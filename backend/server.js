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

import mongoose from "mongoose";

const app = express()
const PORT = process.env.PORT || 3000

// 1. GLOBAL CORS (Highest Priority)
const allowedOrigins = [
    "http://localhost:5173",
    "https://globetrails.netlify.app"
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json())

// 2. DATABASE READINESS
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB Connection Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: err.message
        });
    }
});

// 3. DIAGNOSTICS
app.get('/', async (req, res) => {
    let toursCount = 0;
    try {
        const { Tour } = await import("./models/Tour.js");
        toursCount = await Tour.countDocuments();
    } catch (e) {
        console.error("Diagnostic error:", e.message);
    }

    res.json({
        message: "GlobeTrails API is running",
        version: "1.0.3",
        db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        toursInDB: toursCount,
        originDetected: req.headers.origin || "none"
    });
});

// 4. ROUTES
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/tours', tourRoute)
app.use('/bookings', bookingRoute)
app.use('/admin', adminRoute)

// 5. ERROR HANDLING
app.use((err, req, res, next) => {
    console.error("APP ERROR:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Initializing server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is listening at port ${PORT}`);
    })
}

export default app;