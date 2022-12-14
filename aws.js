"use strict";

/**Class for accessing AWS S3 */
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const fsP = require("fs/promises");
require("dotenv").config();

// create bucket
const pixlyBucket = new AWS.S3({
  apiVersion: "2006-03-01",
});

pixlyBucket.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
pixlyBucket.config.region = process.env.BUCKET_REGION;

const bucketName = process.env.BUCKET_NAME;

const PIXLY_URL = `https://${bucketName}.s3.amazonaws.com`;

// make basic page with title/url submit for testing
// implement uuid to keyname?
// check against/sync database with bucket?
// put file in bucket, get etag and use as primary key

//
class PixlyAWS {
  /**
   * Creates a new bucket with a given name.
   */
  static async createNewBucket(name) {
    const result = pixlyBucket.createBucket({
      Bucket: name,
    });
    // .promise();  definitely add to control order of events
    const response = result.send();
    console.log(response);
  }

  /**
   * Read a local file from a given path
   */
  static async readLocalFileFromPath(filePath) {
    try {
      // changes file to binary buffer
      const result = await fsP.readFile("./hello.txt");
      return result;
    } catch (err) {
      process.exit(1);
    }
  }

  /**
   * Put a new object into the basket
   *
   * Accepts fileData as binary string, fileName as string, fileType as string
   *
   * Returns the uploaded objects ETag
   */
  static async putObjectInBasket(fileData, fileName) {
    fileName = fileName.split(".");
    fileName[0] = fileName[0] + uuid();
    const keyVal = fileName.join(".");

    let params = {
      Body: fileData,
      Bucket: bucketName,
      Key: keyVal,
    };

    //   puts object in bucket
    await pixlyBucket
      .putObject(params, function (err, fileData) {
        console.log("PUT OBJECT!!!!");
        if (err) console.log("DATA ERROR!!!!!", err);
        else console.log("PUT DATA!!!!!!", fileData);
      })
      .promise();

    return this.makeObjectLink(keyVal);
  }

  /**
   * Gets a list of objects currently in the bucket
   * Default amount is 100
   */
  static async getObjectsInBucket(amount = 100) {
    // List objects
    let params = {
      Bucket: bucketName,
      MaxKeys: amount,
      // Marker: start listing from ,
    };

    pixlyBucket.listObjects(params, function (err, data) {
      console.log("LIST OBJECTS!!!!");
      if (err) console.log("LIST ERROR!!!!", err, err.stack);
      else console.log("LIST DATA!!!!!", data);
    });
  }

  /**
   * Gets a single item in the bucket by key value
   */
  static async getSingleObjectInBucket(keyVal) {
    //get params
    let params = {
      Bucket: bucketName,
      Key: keyVal,
    };

    // get object from bucket
    pixlyBucket.getObject(params, function (err, data) {
      console.log("GET OBJECT!!!!");
      if (err) console.log("GET ERROR!!!!", err, err.stack);
      else console.log("GET DATA!!!!!", data); // data.Body is buffer data
    });
  }

  /** Removes a single object from the bucket by key value. */
  static async removeSingleObjectFromBucket(keyVal) {
    let params = {
      Bucket: bucketName,
      Key: keyVal,
    };

    // delete object from bucket
    await pixlyBucket
      .deleteObject(params, function (err, data) {
        console.log("!!!DELETE OBJECT");
        if (err) console.log("DELETE ERROR!!!!!!", err, err.stack);
        else console.log(`!!!Deleted ${keyVal} from bucket.`);
      })
      .promise();
  }

  static makeObjectLink(keyVal) {
    return `${PIXLY_URL}/${keyVal}`;
  }
}

module.exports = PixlyAWS;

//   params = { Bucket: bucketName, Key: "auth-test-hello.txt" };
//   pixlyBucket.getSignedUrl("getObject", params, function (err, data) {
//     if (err) console.log("GET URL ERROR!!!!!!", err);
//     else console.log("GET URL DATA!!!!!", data);
//   });
