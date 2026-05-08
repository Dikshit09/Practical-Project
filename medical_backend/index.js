import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import appointmentRoutes from './models/apointment.js';
import doctorRoutes from './routes/doctor.js'
import medicineScheduleRoutes from './routes/medicineSchedule.js'


dotenv.config()

const app = express();






// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message); 
});

// Middleware
app.use(express.json());
import cors from "cors";

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/medicineSchedule", medicineScheduleRoutes)

const PORT = process.env.PORT || 4000

// Start server
app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`)
})
