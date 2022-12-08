"use strict";

require("dotenv").config();
console.log("env!!!", process.env.DATABASE);
/** Database setup for pixly */

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dialect: "postgres",
});
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testConnection();

const ImageModel = sequelize.define("images", {
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  uploaded_by: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = { sequelize, ImageModel };
