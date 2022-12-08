"use strict";

const express = require("express");

//allows processing of multipart forms
const multer = require("multer");
const upload = multer({});

const app = express();

const AWS = require("./aws.js");
const Image = require("./models/image");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/images", async function (req, res, next) {
  const images = await Image.getImages();
  return res.json({ images });
});

app.post("/images", upload.single("image"), async function (req, res, next) {
  console.log("!!!!!!!!!", req.file);
  console.log("req.body>>>>>>>>>>>", req.body);
  const imageURL = await AWS.putObjectInBasket(
    req.file.buffer,
    req.file.originalname
  );
  const result = await Image.uploadImageData({
    title: "test",
    uploaded_by: "me",
    image_url: imageURL,
    description: "test",
    metadata: 
  });
  console.log("database test", result);
  return res.json({ url: imageURL });
});
// exif get image metadata as an object (json)
// store metadata as column in images table

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
