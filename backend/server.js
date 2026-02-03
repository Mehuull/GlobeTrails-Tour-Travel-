import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from "./routes/userRoute.js"
import authRoute from "./routes/authRoute.js"
import tourRoute from "./routes/tourRoutes.js"
import bookingRoute from "./routes/bookingRoutes.js"
import adminRoute from "./routes/adminRoutes.js"
import cors from 'cors'
import "./config/passport.js"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

const allowedOrigins = [
    "http://localhost:5173",
    "https://globetrails.netlify.app"
];

// Manual CORS middleware as a fallback
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB Middleware Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: err.message
        });
    }
});

// Root route for connection testing
app.get('/', (req, res) => {
    res.json({
        message: "GlobeTrails API is running",
        version: "1.0.2",
        dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        origin: req.headers.origin || "no origin"
    });
});

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/tours', tourRoute)
app.use('/bookings', bookingRoute)
app.use('/admin', adminRoute)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// http://localhost:8000/user/register

import mongoose from "mongoose";

// Initial connection attempt
connectDB().catch(err => console.error("Initial DB connection failed:", err.message));

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is listening at port ${PORT}`);
    })
}

export default app;