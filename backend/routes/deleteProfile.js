const express = require("express");
const User = require("../models/UserDetailsSchema");

const router = express.Router();

// Delete user profile by email
router.delete("/delete", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete profile", details: error.message });
    }
});

module.exports = router;
