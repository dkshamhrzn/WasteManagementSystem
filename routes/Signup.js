const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/UserDetailsSchema");
const Role = require("../models/UserRoleSchema");
const Signup = require("../models/SignupSchema");
const PaymentStatus = require("../models/PaymentStatus"); // <--- Add this line

const router = express.Router();  // We use Router for routes

// Signup route
router.post("/", async (req, res) => {
    try { 
        const { full_name, email, phone_number, password, address, role_name } = req.body;

        if (!full_name || !email || !phone_number || !password || !address || !role_name) {
            return res.status(400).json({ message: "All fields are required" });
        } 

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const role = await Role.findOne({ role_name });
        if (!role) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            full_name,
            email,
            phone_number,
            password: hashedPassword,
            address,
            role_id: role._id,
        });

        await newUser.save();

        const newSignup = new Signup({
            user_id: newUser._id,
            verification_status: false,
        });

        await newSignup.save();

        // ✅ Create initial payment status (default is 'unpaid')
        const paymentStatus = new PaymentStatus({
            email: newUser.email,
            status: "unpaid", // Optional since default is unpaid
        });

        await paymentStatus.save();

        res.status(201).json({
            message: "Signup successful",
            user: newUser,
            signup: newSignup,
            paymentStatus: paymentStatus,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;
