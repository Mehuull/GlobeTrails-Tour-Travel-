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
        enum: ["pending", "confirmed", "rejected", "cancelled"], // Added cancelled
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "deposit_paid", "full_paid", "refunded"],
        default: "pending"
    },

    finalPrice: Number,        // same as totalAmount
    depositAmount: Number,     // 40% of finalPrice
    balanceAmount: Number,     // 60% of finalPrice

    razorpayDepositOrderId: String,
    razorpayDepositPaymentId: String,

    razorpayBalanceOrderId: String,
    razorpayBalancePaymentId: String,

    cancellationRefundAmount: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;