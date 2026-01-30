import Booking from "../models/Booking.js";
import { Tour } from "../models/Tour.js";
import { sendBookingInquiryEmail, sendBookingConfirmationEmail } from "../utils/bookingEmails.js";

// Create new booking inquiry
export const createBooking = async (req, res) => {
    try {
        const { tour, preferredStartDate, guests, contactDetails, finalPrice } = req.body;

        // Check if user already has an active booking for this tour
        const existingBooking = await Booking.findOne({
            user: req.userId,
            tour: tour,
            preferredStartDate: { $gte: new Date().setHours(0, 0, 0, 0) } // Date hasn't passed today
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "You already have an active booking for this tour."
            });
        }

        const booking = new Booking({
            user: req.userId, // From isAuthenticated middleware
            tour,
            preferredStartDate,
            guests,
            contactDetails,
            finalPrice
        });

        await booking.save();

        // Send Email Notification
        const tourDetails = await Tour.findById(tour);
        await sendBookingInquiryEmail(
            booking,
            tourDetails.title,
            contactDetails.email,
            req.user.username
        );

        res.status(201).json({ success: true, message: "Booking inquiry sent successfully", data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to create booking", error: error.message });
    }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
    try {
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
        const bookings = await Booking.find()
            .populate("user", "username email")
            .populate("tour", "title pricePerPerson")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings", error: error.message });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { inquiryStatus: status },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Send confirmation email if status changed to 'confirmed'
        if (status === 'confirmed') {
            // Populate tour and user to get details for email
            const fullBooking = await Booking.findById(req.params.id)
                .populate("tour", "title")
                .populate("user", "username email");

            await sendBookingConfirmationEmail(
                fullBooking,
                fullBooking.tour.title,
                fullBooking.contactDetails.email || fullBooking.user.email,
                fullBooking.user.username
            );
        }

        res.status(200).json({ success: true, message: "Booking status updated", data: booking });
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

        // Check if cancellation is at least 20 days before the tour date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tourDate = new Date(booking.preferredStartDate);
        tourDate.setHours(0, 0, 0, 0);

        const diffInTime = tourDate.getTime() - today.getTime();
        const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));

        if (diffInDays < 20) {
            return res.status(400).json({
                success: false,
                message: "Cancellations are only allowed at least 20 days before the tour date."
            });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to cancel booking", error: error.message });
    }
};
