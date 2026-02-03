import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema)