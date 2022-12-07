const { S3 } = require("aws-sdk");
const AWS = require("aws-sdk");
const uuid = require("uuid");
const fsP = require("fs/promises");

// create bucket
const pixlyBucket = new AWS.S3({ apiVersion: "2006-03-01" });
const bucketName = "pixly12345";

// make a class

// wrap functions in async wrapper to better control when we get them back

// make basic page with title/url submit for testing
// implement uuid to keyname?
// check against/sync database with bucket?

//
function create() {
  const result = pixlyBucket.createBucket({
    Bucket: bucketName,
  });
  // .promise();  definitely add to control order of events
  const response = result.send();
  console.log(response);
}

async function readMyFile() {
  try {
    // changes file to binary buffer
    const result = await fsP.readFile("./pexels-philippe-donn-1133957.jpg");

    // create object {Body: readFile binary, Bucket: string, Key: string}
    let imageParams = {
      Body: result,
      Bucket: bucketName,
      Key: "test-image1.jpg",
    };

    // puts object in bucket
    pixlyBucket.putObject(imageParams, function (err, data) {
      console.log("PUT OBJECT!!!!");
      if (err) console.log("DATA ERROR!!!!!", err);
      else console.log("PUT DATA!!!!!!", data);
    });
  } catch (err) {
    process.exit(1);
  }

  // List objects
  let params = {
    Bucket: bucketName,
    MaxKeys: 100,
    // Marker: start listing from ,
  };

  pixlyBucket.listObjects(params, function (err, data) {
    console.log("LIST OBJECTS!!!!");
    if (err) console.log("LIST ERROR!!!!", err, err.stack);
    else console.log("LIST DATA!!!!!", data);
  });

  // get params
  params = {
    Bucket: bucketName,
    Key: "test-image.jpg",
  };

  // get object from bucket
  pixlyBucket.getObject(params, function (err, data) {
    console.log("GET OBJECT!!!!");
    if (err) console.log("GET ERROR!!!!", err, err.stack);
    else console.log("GET DATA!!!!!", data); // data.Body is buffer data
  });
}

create();
readMyFile();

// Will overwrite if key name is the same
// etag depends on content
