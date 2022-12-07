"use strict";

/** Database setup for pixly */

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  storage: process.env.DB_URI,
  dialect: "postgres",
});

sequelize.connect();

module.exports = sequelize;
