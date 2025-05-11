const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Make sure .env variables are loaded

// Admin approves a pickup request
router.put("/approve/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const { admin_confirmed_date, admin_confirmed_time } = req.body;

        const request = await PickupRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Pickup request not found" });
        }

        // Update the request status and confirmed date/time
        request.status = "Approved";
        request.admin_confirmed_date = admin_confirmed_date;
        request.admin_confirmed_time = admin_confirmed_time;
        await request.save();

        res.json({ message: "Request approved and user notified", request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error approving request", error: error.message });
    }
});

module.exports = router;
