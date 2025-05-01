const express = require("express");
const User = require("../models/UserDetailsSchema");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Update user profile by email
router.put("/update", async (req, res) => {
    try {
        const { email, full_name, new_email, phone_number, address, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Current email is required to identify the user" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the fields provided
        if (full_name) user.full_name = full_name;
        if (new_email) user.email = new_email;  // To change email
        if (phone_number) user.phone_number = phone_number;
        if (address) user.address = address;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
});  

module.exports = router;
