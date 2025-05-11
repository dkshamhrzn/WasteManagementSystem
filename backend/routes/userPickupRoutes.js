// routes/userPickupRoutes.js
const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");

// Get a user's pickup request by ID
router.get("/:id", async (req, res) => {
    try {
        const request = await PickupRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        res.json({ request });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch request", error: error.message });
    }
});

module.exports = router;
