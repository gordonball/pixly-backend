"use strict";

const express = require("express");
const app = express();

app.use(express.raw());
app.use(express.json());

module.exports = app;