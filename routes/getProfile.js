const express = require("express");
const User = require("../models/UserDetailsSchema");

const router = express.Router();

// Get user profile by ID
router.get("/read", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId).select("-password"); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile fetched successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile", details: error.message });
    }
});

module.exports = router;
