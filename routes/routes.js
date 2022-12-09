"use strict";

const express = require("express");
const router = new express.Router();
const AWS = require("../aws");
const Image = require("../models/image");

//allows processing of multipart forms
const multer = require("multer");
const PixlyAWS = require("../aws");
const upload = multer({});

/** Gets an array of all images, returns as json object
 *
 * {[{description, image_url, metadata, title, uploaded_by}]}
 */
router.get("/images", async function (req, res, next) {
  const images = await Image.getImages();
  return res.json({ images });
});

/** Gets the metadata from an image,
 *  uploads image to AWS and adds image to database.
 *
 * Returns image url as json object
 * {url: imageURL}
 *
 * */
router.post("/images", upload.single("image"), async function (req, res, next) {
  console.log("!!!!!!!!!", req.file);
  console.log("req.body>>>>>>>>>>>", req.body);
  const { title, uploaded_by, description } = req.body;

  const metadata = await Image.getMetadata(req.file.buffer);
  console.log("App METADATA!!!!!", metadata);
  //TODO: rename!
  const imageURL = await AWS.putObjectInBasket(
    req.file.buffer,
    req.file.originalname
  );
  const result = await Image.uploadImageData({
    title: title,
    uploaded_by: uploaded_by,
    image_url: imageURL,
    description: description,
    metadata: metadata.tags || null,
  });
  console.log("database test", result);
  return res.json({ url: imageURL });
});

/** Deletes image from AWS and from database */
router.delete("/images/:filename", async function (req, res, next) {
  console.log("delete params", req.params);
  const filename = req.params.filename;

  const keyVal = PixlyAWS.makeObjectLink(filename);
  await Image.deleteImage(keyVal);
  // console.log("delete image: ", filename);
  await AWS.removeSingleObjectFromBucket(filename);
});

module.exports = router;
