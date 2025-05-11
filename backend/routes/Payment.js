const express = require('express');
// const fetch = require('node-fetch');
const router = express.Router();

const PaymentStatus = require("../models/PaymentStatus");
router.put("/initial-payment", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    console.log("Received email:", email); // Log the received email

    // Try to find and update the payment status
    const updated = await PaymentStatus.findOneAndUpdate(
      { email: email.toLowerCase() },  // Make sure email is lowercase
      { status: "paid", updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      console.log(`No user found with email: ${email}`);  // Log if no user is found
      return res.status(404).json({ message: "User not found with that email." });
    }

    // Log the updated payment status
    console.log("Payment status updated:", updated);

    res.status(200).json({ message: "Payment status updated to 'paid'.", updated });
  } catch (err) {
    console.error("Payment update error:", err);  // Log the error if something goes wrong
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get("/status", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required in query params." });
  }

  try {
    const record = await PaymentStatus.findOne({ email: email.toLowerCase() });

    if (!record) {
      return res.status(404).json({ message: "No payment record found for this email." });
    }

    res.status(200).json({ status: record.status, updatedAt: record.updatedAt });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
