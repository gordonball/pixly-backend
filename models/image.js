"use strict";

const {sequelize, ImageModel} = require("../db");

const { BadRequestError, NotFoundError } = require("../expressError");





class Image {

  /**
   *  upload imageData to the database.
   */
  static async uploadImageData({ title, uploaded_by, image_url, description }) {
   
   
   const result = await sequelize.transaction(
      ImageModel.create({ title, uploaded_by, image_url, description })
   ); 

   console.log(result)
    //Start transaction
    //Add values to db
    //Commit
  }
}

module.exports = Image;

// Image.uploadImageData({title: "test", uploaded_by:"me", image_url:"test1", description:"test"})