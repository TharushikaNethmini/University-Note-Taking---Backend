const DB_URL = process.env.DB_URL;
const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};

module.exports = connectDB;