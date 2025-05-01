const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");

// POST /request-pickup
router.post("/", async (req, res) => {
    try {
        const {
            waste_type,
            quantity,
            location,
            preferred_date,
            preferred_time,
            notes
        } = req.body;

        if (!waste_type || !quantity || !location || !preferred_date || !preferred_time) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Simple price estimation logic (adjust as needed)
        let estimated_price = 0;
        if (quantity.toLowerCase().includes("kg")) {
            const num = parseFloat(quantity);
            estimated_price = num * 100; // Rs. 100 per kg
        } else if (quantity.toLowerCase().includes("bag")) {
            const num = parseFloat(quantity);
            estimated_price = num * 10; // Rs. 50 per bag
        }

        const pickup = new PickupRequest({
            waste_type,
            quantity,
            location,
            preferred_date,
            preferred_time,
            notes,
            estimated_price
        });

        await pickup.save();

        res.status(201).json({ message: "Pickup request submitted", pickup });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit pickup request", error: error.message });
    }
});

module.exports = router;
