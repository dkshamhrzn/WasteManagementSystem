const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({
  waste_type: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  preferred_date: {
    type: String,
    required: true,
  },
  preferred_time: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
  estimated_price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected","Complete"],
    default: "Pending",
  },
  user_email: {
    type: String,
    required: true,
  },
  admin_confirmed_date: {
    type: String,
    default: null,
  },
  admin_confirmed_time: {
    type: String,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);
