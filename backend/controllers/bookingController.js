import Booking from "../models/Booking.js";
import { Tour } from "../models/Tour.js";
import { sendBookingInquiryEmail, sendBookingConfirmationEmail, sendFullPaymentConfirmationEmail } from "../utils/bookingEmails.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { generateReceipt } from "../utils/receiptGenerator.js";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "dummysetcret"
});
// Create new booking inquiry -> now initializes booking and razorpay order
export const createBooking = async (req, res) => {
    try {
        const { tour, preferredStartDate, guests, contactDetails, finalPrice } = req.body;

        // Validation: Booking must be at least 10 days in advance
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 10);
        minDate.setHours(23, 59, 59, 999); // End of the 10th day
        
        if (new Date(preferredStartDate) <= minDate) {
            return res.status(400).json({
                success: false,
                message: "Tours must be booked at least 11 days in advance."
            });
        }

        // Check if user already has an active booking for this tour
        const existingBooking = await Booking.findOne({
            user: req.userId,
            tour: tour,
            preferredStartDate: { $gte: new Date().setHours(0, 0, 0, 0) }, // Date hasn't passed today
            inquiryStatus: { $ne: "cancelled" }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "You already have an active booking for this tour."
            });
        }

        const depositAmount = Math.round(Number(finalPrice) * 0.4);
        const balanceAmount = Number(finalPrice) - depositAmount;

        const booking = new Booking({
            user: req.userId, // From isAuthenticated middleware
            tour,
            preferredStartDate,
            guests,
            contactDetails,
            finalPrice,
            depositAmount,
            balanceAmount
        });

        await booking.save();

        // Send Email Notification (Inquiry)
        const tourDetails = await Tour.findById(tour);
        await sendBookingInquiryEmail(
            booking,
            tourDetails.title,
            contactDetails.email,
            req.user.username
        );

        // Create Razorpay deposit order
        const options = {
            amount: depositAmount * 100, // convert to paise
            currency: "INR",
            receipt: `booking_${booking._id}`
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        booking.razorpayDepositOrderId = razorpayOrder.id;
        await booking.save();

        res.status(201).json({
            success: true,
            message: "Booking initialized",
            data: booking,
            razorpayOrder,
            finalAmount: finalPrice
        });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to create booking", error: error.message });
    }
};

// Verify payment for deposit
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "dummysetcret")
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    paymentStatus: "deposit_paid",
                    inquiryStatus: "pending", // stays pending until admin confirms
                    razorpayDepositPaymentId: razorpay_payment_id
                },
                { new: true }
            ).populate("tour", "title").populate("user", "username email");

            // Generate receipt
            const receiptBuffer = await generateReceipt(booking, booking.tour.title, 'deposit');

            // Send confirmation email with receipt
            await sendBookingConfirmationEmail(
                booking,
                booking.tour.title,
                booking.contactDetails.email || booking.user.email,
                booking.user.username,
                receiptBuffer
            );

            return res.status(200).json({ success: true, message: "Payment verified successfully", data: booking, receiptAvailable: true });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to verify payment", error: error.message });
    }
};

// Create Full Payment Order
export const createFullPaymentOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking || booking.paymentStatus !== "deposit_paid") {
            return res.status(400).json({ success: false, message: "Invalid booking or payment already completed" });
        }

        const options = {
            amount: booking.balanceAmount * 100,
            currency: "INR",
            receipt: `balance_${booking._id}`
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        booking.razorpayBalanceOrderId = razorpayOrder.id;
        await booking.save();

        res.status(200).json({ success: true, razorpayOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create full payment order", error: error.message });
    }
};

// Verify Full Payment
export const verifyFullPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "dummysetcret")
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    paymentStatus: "full_paid",
                    razorpayBalancePaymentId: razorpay_payment_id
                },
                { new: true }
            ).populate("tour", "title").populate("user", "username email");

            // Generate receipt
            const receiptBuffer = await generateReceipt(booking, booking.tour.title, 'full');

            // Send full payment confirmation email with receipt
            await sendFullPaymentConfirmationEmail(
                booking,
                booking.tour.title,
                booking.user.email,
                booking.user.username,
                receiptBuffer
            );

            return res.status(200).json({ success: true, message: "Full payment verified successfully", data: booking, receiptAvailable: true });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to verify full payment", error: error.message });
    }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Delete past bookings automatically to clear from DB and 'My Bookings'
        await Booking.deleteMany({
            user: req.userId,
            preferredStartDate: { $lt: today }
        });

        const bookings = await Booking.find({ user: req.userId })
            .populate("tour", "title images pricePerPerson duration")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user bookings", error: error.message });
    }
};

// Get all bookings (Admin)
export const getAllBookings = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Clean up all past bookings globally
        await Booking.deleteMany({
            preferredStartDate: { $lt: today }
        });

        const bookings = await Booking.find()
            .populate("user", "username email")
            .populate("tour", "title pricePerPerson")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings", error: error.message });
    }
};

// Update booking status (Admin: confirm or reject)
export const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("tour", "title")
            .populate("user", "username email");

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.inquiryStatus = status;

        // If admin REJECTS the booking, apply refund logic
        if (status === 'rejected') {
            const totalPaid = booking.paymentStatus === "full_paid" 
                ? booking.finalPrice 
                : (booking.paymentStatus === "deposit_paid" ? booking.depositAmount : 0);
            
            // Admin rejected = 100% refund of whatever was paid
            const refundAmount = totalPaid;
            booking.cancellationRefundAmount = refundAmount;
            booking.paymentStatus = refundAmount > 0 ? "refunded" : booking.paymentStatus;
        }

        // If admin CONFIRMS, send confirmation email
        if (status === 'confirmed') {
            await sendBookingConfirmationEmail(
                booking,
                booking.tour.title,
                booking.contactDetails.email || booking.user.email,
                booking.user.username
            );
        }

        await booking.save();

        const message = status === 'rejected' 
            ? `Booking rejected. Refund of ₹${booking.cancellationRefundAmount} will be processed.`
            : `Booking ${status} successfully.`;

        res.status(200).json({ success: true, message, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to update booking", error: error.message });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found or unauthorized" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tourDate = new Date(booking.preferredStartDate);
        tourDate.setHours(0, 0, 0, 0);

        const diffInTime = tourDate.getTime() - today.getTime();
        const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));

        let refundPercentage = 0;

        if (diffInDays >= 30) {
            refundPercentage = 100;
        } else if (diffInDays >= 15) {
            refundPercentage = 50;
        } else if (diffInDays >= 7) {
            refundPercentage = 25;
        } else {
            refundPercentage = 0;
        }

        const totalPaid = booking.paymentStatus === "full_paid" ? booking.finalPrice : (booking.paymentStatus === "deposit_paid" ? booking.depositAmount : 0);
        const refundAmount = (totalPaid * refundPercentage) / 100;

        booking.inquiryStatus = "cancelled";
        booking.paymentStatus = refundAmount > 0 ? "refunded" : booking.paymentStatus;
        booking.cancellationRefundAmount = refundAmount;

        await booking.save();

        res.status(200).json({
            success: true,
            message: `Booking cancelled successfully. Refund amount: ₹${refundAmount} (${refundPercentage}%)`,
            refundAmount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to cancel booking", error: error.message });
    }
};

// Permanently delete a booking (used when payment fails or user closes the razorpay modal before completing it)
export const deleteBookingPermanently = async (req, res) => {
    try {
        const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.userId, paymentStatus: "pending" });
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found or cannot be modified" });
        }
        res.status(200).json({ success: true, message: "Unpaid booking explicitly removed." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to remove unpaid booking", error: error.message });
    }
};
// Download Receipt
export const downloadReceipt = async (req, res) => {
    try {
        const { bookingId, paymentType } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate("tour", "title")
            .populate("user", "username email");

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Check if user is authorized (either the owner or an admin)
        const isOwner = booking.user._id.toString() === req.userId.toString();
        const isAdmin = req.user?.role === 'admin' || req.user?.username === 'Admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized to download this receipt" });
        }

        const receiptBuffer = await generateReceipt(booking, booking.tour.title, paymentType);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Receipt_${paymentType}_${bookingId}.pdf`);
        res.send(receiptBuffer);
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to generate receipt", error: error.message });
    }
};
