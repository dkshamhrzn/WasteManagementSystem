const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({
    waste_type: { type: String, required: true },
    quantity: { type: String, required: true }, // e.g., '5 kg' or '3 bags'
    location: { type: String, required: true },
    preferred_date: { type: String, required: true },
    preferred_time: { type: String, required: true },
    notes: { type: String, default: "" },
    estimated_price: { type: Number, default: 0 },
    requested_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);
