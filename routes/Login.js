const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/UserDetailsSchema");

const router = express.Router();
 
// Login Route
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).populate('role_id');
 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                role: user.role_id.role_name,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
