import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/GlobeTrails`)
        console.log('MongoDB connected successfully');

    } catch (error) {
        console.log('MongoDb connection error', error);

    }
}

export default connectDB;