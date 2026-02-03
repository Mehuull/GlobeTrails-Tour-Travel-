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

// 1. CORS Setup (Simplified for maximum compatibility)
const allowedOrigins = [
    "https://globetrails.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // If origin is in whitelist or is a netlify/vercel preview, allow it
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin);
            callback(null, true); // Fallback: allow for debugging, or you can use callback(new Error('CORS'));
        }
    },
    credentials: true
}));

app.use(express.json())

// 2. DATABASE READINESS MIDDLEWARE
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Critical DB Error:", err.message);
        // On Vercel, we want to see the error in the response temporarily for debugging
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: err.message,
            tip: "Check MONGO_URI and IP Whitelist (0.0.0.0/0) in Atlas"
        });
    }
});

// 3. DIAGNOSTICS & VERSIONING
app.get('/', async (req, res) => {
    try {
        const { Tour } = await import("./models/Tour.js");
        const count = await Tour.countDocuments();
        res.json({
            status: "Online",
            version: "1.0.6",
            database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
            tours_count: count,
            headers: req.headers
        });
    } catch (error) {
        res.json({
            status: "Online",
            version: "1.0.4",
            database: "Error: " + error.message
        });
    }
});

// 4. API ROUTES
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/tours', tourRoute)
app.use('/bookings', bookingRoute)
app.use('/admin', adminRoute)

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("SERVER CRASH:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

// Start local server if not on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Development server running at http://localhost:${PORT}`);
    })
}

export default app;