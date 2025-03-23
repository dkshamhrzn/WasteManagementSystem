// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Role = require("./models/UserRoleSchema");
const signupRouter = require("./routes/Signup");
const loginRouter = require("./routes/Login");
const forgotPasswordRouter = require("./routes/ForgotPassword");
const resetPasswordRouter = require("./routes/ResetPassword");
const otpVerificationRouter = require("./routes/otpVerification");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
const mongooseURL = "mongodb+srv://wastewise:BdvheLPluzRPwfxr@cluster0.5r3mk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongooseURL)
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

// Use the signup, login, forgot-password, and reset-password routes
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/api/verify-otp", otpVerificationRouter);

// Start the server
app.listen(5001, () => {
    console.log("Server running on port 5001");
});
