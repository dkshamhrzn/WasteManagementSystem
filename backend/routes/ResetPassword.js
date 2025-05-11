const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/UserDetailsSchema");

const router = express.Router();

router.post("/", async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    try {
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Find user with a valid token that is not expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Clear reset token fields
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        // Save the updated user
        await user.save();
        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;
