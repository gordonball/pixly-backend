"use strict";

const sequilize = require("../db");

const { BadRequestError, NotFoundError } = require("../expressError");

class Image {
  /** upload an image */
  static async upload({ title, uploaded_by, url }) {
    const upload = sequilize.transaction();
    const 
  }
}
