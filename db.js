import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const DB_URL = process.env.DB_URL;

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

export default connectDB;