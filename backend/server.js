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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/tours', tourRoute)
app.use('/bookings', bookingRoute)
app.use('/admin', adminRoute)

// http://localhost:8000/user/register


app.listen(PORT, () => {
    connectDB()
    console.log(`Server is listening at port ${PORT}`);
})