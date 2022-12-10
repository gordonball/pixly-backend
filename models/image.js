"use strict";

const { sequelize, ImageModel } = require("../db");
// const ExifImage = require("exif").ExifImage;
const parser = require("exif-parser");

const { BadRequestError, NotFoundError } = require("../expressError");

class Image {
   /**
    *  upload imageData to the database.
    */
   static async uploadImageData({
      title,
      uploaded_by,
      image_url,
      description,
      metadata,
   }) {
      const result = await sequelize.transaction(
         ImageModel.create({
            title,
            uploaded_by,
            image_url,
            description,
            metadata,
         })
      );

      console.log(result);
      //Start transaction
      //Add values to db
      //Commit
   }

   /**
    *  Get a list of all images from the database
    */
   static async getImages() {
      const result = ImageModel.findAll();

      return result;
   }

   /**
    * Get image metadata from image buffer data
    */
   static async getMetadata(image) {
      return parser.create(image).enableReturnTags(true).parse();
   }

   /**
    * Delete image from DB
    */
   static async deleteImage(image) {
      console.log(image);
      const result = ImageModel.destroy({
         where: { image_url: image },
      });
   }
}

module.exports = Image;

// Image.uploadImageData({title: "test", uploaded_by:"me", image_url:"test1", description:"test"})
