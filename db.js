"use strict";

/** Database setup for pixly */

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
   process.env.DATABASE,
   process.env.DATABASE_USER,
   process.env.DATABASE_PASSWORD,
   {
     dialect: 'postgres',
   },
 );
async function testConnection(){
try {
   await sequelize.authenticate();
   console.log('Connection has been established successfully.');
 } catch (error) {
   console.error('Unable to connect to the database:', error);
 }
}
testConnection();

const ImageModel = sequelize.define("image", {
   image_url: { 
      type: DataTypes.TEXT, 
      allowNull: false,
      primaryKey:true,
    },
   title: { type: DataTypes.TEXT, allowNull: false },
   description: { type: DataTypes.TEXT, allowNull: false },
   uploaded_by: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = { sequelize, ImageModel };
