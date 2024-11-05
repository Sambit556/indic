const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL,{
        });
        console.log("Connected to MongoDB 🎯🍃");
    } catch (error) {
        console.error("Failed to connect to MongoDB 😥", error);
        process.exit(1);
    }
};

module.exports = connectDB;
