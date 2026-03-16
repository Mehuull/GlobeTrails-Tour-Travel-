import express from "express";
import {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    cancelBooking,
    verifyPayment,
    createFullPaymentOrder,
    verifyFullPayment
} from "../controllers/bookingController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, createBooking);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.post("/create-full-payment", isAuthenticated, createFullPaymentOrder);
router.post("/verify-full-payment", isAuthenticated, verifyFullPayment);
router.get("/my-bookings", isAuthenticated, getUserBookings);
router.delete("/:id", isAuthenticated, cancelBooking);

// Admin only routes
router.get("/", getAllBookings);
router.put("/:id", updateBookingStatus);

export default router;
