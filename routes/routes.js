"use strict";

const AWS = require("./aws.js");
const Image = require("./models/image");

//allows processing of multipart forms
const multer = require("multer");
const upload = multer({});

app.get("/images", async function (req, res, next) {
  const images = await Image.getImages();
  return res.json({ images });
});

app.post("/images", upload.single("image"), async function (req, res, next) {
  console.log("!!!!!!!!!", req.file);
  console.log("req.body>>>>>>>>>>>", req.body);

  const metadata = await Image.getMetadata(req.file.buffer);
  console.log("App METADATA!!!!!", metadata);

  const imageURL = await AWS.putObjectInBasket(
    req.file.buffer,
    req.file.originalname
  );
  const result = await Image.uploadImageData({
    title: "test",
    uploaded_by: "me",
    image_url: imageURL,
    description: "test",
    metadata: metadata.tags || null,
  });
  console.log("database test", result);
  return res.json({ url: imageURL });
});

app.delete("/images/:filename", async function (req, res, next) {
  const image = req.params.filename;

  await AWS.removeSingleObjectFromBucket(image);
  console.log("app.delete res", res);
});
