const express = require("express");
const User = require("../models/UserDetailsSchema");

const router = express.Router();

// Get user profile by email
router.get("/read", async (req, res) => {
    try {
        const { email } = req.query;  // Get the email from the query string

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find the user by email and select only the required fields (excluding password)
        const user = await User.findOne({ email }).select("full_name email phone_number address");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile fetched successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile", details: error.message });
    }
});

module.exports = router;
