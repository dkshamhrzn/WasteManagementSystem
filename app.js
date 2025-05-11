// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();



const Role = require("./models/UserRoleSchema");
const signupRouter = require("./routes/Signup");
const loginRouter = require("./routes/Login");
const forgotPasswordRouter = require("./routes/ForgotPassword");
const resetPasswordRouter = require("./routes/ResetPassword");
const otpVerificationRouter = require("./routes/otpVerification");
const truckSchedulesRoutes = require("./routes/truckSchedules");
const TruckSchedule = require("./models/TruckSchedule"); // Import the TruckSchedule model
const paymentRouter = require("./routes/Payment");
const getProfileRouter = require("./routes/getProfile");
const deleteProfileRouter = require("./routes/deleteProfile"); // Import the delete profile router

const userRoutes = require("./routes/userRoutes"); // For cloudinary
const updateProfileRouter = require("./routes/updateProfile");
const requestPickupRouter = require("./routes/requestPickup");
const adminPickupRoutes = require("./routes/adminPickupRoutes");
const userPickupRoutes = require("./routes/userPickupRoutes");

// const paymentRoutes = require('./routes/Payment');

const paymentRoutes = require('./routes/Payment');


const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());


const path = require("path");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional route for direct access
app.get("/initialpayment", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "initialPayment.html"));
});
app.get("/generalpayment", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "generalPayment.html"));
});


// Connect to MongoDB
const mongooseURL = process.env.MONGODB_URI;
mongoose
    .connect(mongooseURL)
    .then(() => {
        console.log("MongoDB connected");

        // Add roles if they don't exist
        Role.findOne({ role_name: 'admin' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'admin' });
                console.log("Admin role created.");
            }
        });

        Role.findOne({ role_name: 'user' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'user' });
                console.log("User role created.");
            }
        });

        Role.findOne({ role_name: 'driver' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'driver' });
                console.log("Driver role created.");
            }
        });
    })
    .catch((err) => console.log("MongoDB connection error:", err));

// Use the signup, login, forgot-password, reset-password, and other routes
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/verify-otp", otpVerificationRouter);
app.use("/truck-schedules", truckSchedulesRoutes);
app.use("/payment", paymentRouter);

app.use("/userProfilePicture", userRoutes);
app.use("/update-profile", updateProfileRouter);
app.use("/get-profile", getProfileRouter);
app.use("/delete-profile", deleteProfileRouter);  // Use the delete-profile route

app.use("/request-pickup", requestPickupRouter);
app.use("/pickup/admin", adminPickupRoutes); // Admin routes
app.use("/pickup/user", userPickupRoutes);   // User routes

app.use('/api/payment', paymentRoutes);

// Start the server
app.listen(5001, () => {
    console.log("Server running on port 5001");
});
