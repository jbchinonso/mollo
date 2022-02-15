const mongoose = require("mongoose")
require("dotenv").config()


module.exports = function () {
  const db = process.env.DB_ADDR
  mongoose.connect(db).then(() => console.log(`Connected to ${db}...`));
};