const mongoose = require("mongoose");

const paymentStatusSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    required: true,
    default: "unpaid"
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PaymentStatus = mongoose.model("PaymentStatus", paymentStatusSchema);

module.exports = PaymentStatus;
