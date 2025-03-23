const express = require("express");
const User = require("../models/UserDetailsSchema");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "OTP is required" });
        }

        // Find user with valid reset token that has not expired
        const user = await User.findOne({
            resetToken: token, 
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // OTP is valid, respond with success
        res.json({ message: "OTP verified successfully, you can now reset your password." });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;
