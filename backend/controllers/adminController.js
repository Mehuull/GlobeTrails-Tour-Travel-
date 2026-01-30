import { User } from "../models/userModel.js";
import { Tour } from "../models/Tour.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const tourCount = await Tour.countDocuments();
        const bookingCount = await Booking.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                users: userCount,
                tours: tourCount,
                bookings: bookingCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: error.message
        });
    }
};
