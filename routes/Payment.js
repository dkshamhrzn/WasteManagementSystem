const express = require('express');
// const fetch = require('node-fetch');
const router = express.Router();

// const KHALTI_SECRET_KEY = 'live_secret_key_68791341fdd94846a146f0457ff7b455';

// // Khalti Payment Verification Route
// router.post('/verify/khalti', async (req, res) => {
//     const { token, amount } = req.body;

//     try {
//         const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Key ${KHALTI_SECRET_KEY}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ token, amount })
//         });

//         const data = await response.json();

//         if (response.ok && data.idx) {
//             res.json({ success: true, data });
//         } else {
//             res.status(400).json({ success: false, error: data });
//         }
//     } catch (error) {
//         console.error('Error verifying Khalti payment:', error);
//         res.status(500).json({ success: false, error: 'Server error' });
//     }
// });
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

module.exports = router;
