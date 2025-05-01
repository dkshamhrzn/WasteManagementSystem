const express = require("express");
const User = require("../models/UserDetailsSchema");

const router = express.Router();

// Get user profile by email
router.get("/read", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email }).select("full_name email phone_number address");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile fetched successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile", details: error.message });
    }
});

// View all users and count
router.get("/all", async (req, res) => {
    try {
        const users = await User.find().select("full_name email phone_number address");
        const count = users.length;

        res.json({
            message: "All users fetched successfully",
            count,
            users
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users", details: error.message });
    }
});

module.exports = router;
