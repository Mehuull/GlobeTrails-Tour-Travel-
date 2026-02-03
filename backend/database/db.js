import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== 'string') {
            throw new Error("MONGO_URI is missing or invalid in environment variables");
        }

        // Use the URI exactly as provided, or append db name safely
        const uri = process.env.MONGO_URI.includes('?')
            ? process.env.MONGO_URI.replace(/\/\?/, '/GlobeTrails?')
            : `${process.env.MONGO_URI}/GlobeTrails`;

        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Throw the error so the calling function knows we failed
        throw error;
    }
}

export default connectDB;