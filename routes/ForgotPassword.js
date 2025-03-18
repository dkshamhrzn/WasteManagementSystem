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
            host: process.env.EMAIL_HOST, // Use Mailtrap or SMTP service
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Send email with reset link
        const resetLink = `http://localhost:5173/reset-password/${token}`;
        const mailOptions = {
            from: `"Support Team" <no-reply@wastewise.com>`, // Use a proper sender email
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Hello,</p>
                   <p>We received a request to reset your password. Click the link below to reset it:</p>
                   <p><a href="${resetLink}">Reset Password</a></p>
                   <p>If you did not request this, please ignore this email.</p>`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ message: "Reset link sent to your email" });
    } catch (error) {
        console.error("Error processing password reset:", error.message); // Print the error message
        console.error("Error stack trace:", error.stack); // Print the full stack trace
        res.status(500).json({
            message: "Internal server error",
            error: error.message,  // Return the error message in the response for easier debugging
        });
    }
});

module.exports = router;
