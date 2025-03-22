// routes/ForgotPassword.js
const express = require("express");
const crypto = require("crypto");
const User = require("../models/UserDetailsSchema");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate a secure reset token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Setup Nodemailer transport using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Send email with reset token
        const mailOptions = {
            from: `"Support Team" <no-reply@wastewise.com>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Hello,</p>
                   <p>We received a request to reset your password. Use the token below to reset it:</p>
                   <p><strong>Reset Token: ${token}</strong></p>
                   <p>Enter this token in the app to reset your password.</p>
                   <p>If you did not request this, please ignore this email.</p>`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ message: "Reset token sent to your email" });
    } catch (error) {
        console.error("Error processing password reset:", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
