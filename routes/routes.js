"use strict";

const express = require("express");
const router = new express.Router();
const AWS = require("../aws");
const Image = require("../models/image");

//allows processing of multipart forms
const multer = require("multer");
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
  const {title, uploaded_by, description} = req.body;

  const metadata = await Image.getMetadata(req.file.buffer);
  console.log("App METADATA!!!!!", metadata);

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
  const image = req.params.filename;
  await Image.deleteImage(image);
  await AWS.removeSingleObjectFromBucket(image);
  console.log("delete image: ", image);
});

module.exports = router;
