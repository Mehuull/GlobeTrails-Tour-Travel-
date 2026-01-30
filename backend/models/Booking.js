import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: true
    },

    preferredStartDate: {
        type: Date,
        required: true
    },

    guests: {
        type: Number,
        required: true
    },

    contactDetails: {
        phone: String,
        email: String
    },

    inquiryStatus: {
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        default: "pending"
    },

    finalPrice: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
