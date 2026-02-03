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

app.use(cors({
    origin: function (origin, callback) {
        // Broaden allowed origins for debugging
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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
        dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        env: process.env.NODE_ENV
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