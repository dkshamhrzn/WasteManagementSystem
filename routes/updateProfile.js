const express = require("express");
const User = require("../models/UserDetailsSchema");

const router = express.Router();

// Update user profile
router.put("/update", async (req, res) => {
    try {
        const { userId, full_name, email, phone_number, address, password } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.full_name = full_name || user.full_name;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.address = address || user.address;
        
        // Optionally, update password if provided
        if (password) {
            const bcrypt = require("bcryptjs");
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
});

module.exports = router;
