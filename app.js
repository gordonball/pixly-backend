"use strict";

const express = require("express");
const app = express();

const AWS = require("./aws.js");
const Image = require("./models/image");

app.use(express.json());
// app.use(express.text());
app.use(express.raw());

app.post("/images", async function (req, res, next) {
  // const validator

  console.log("!!!!!!!!!", req);

  // const imageURL = await AWS.putObjectInBasket();
});

module.exports = app;
