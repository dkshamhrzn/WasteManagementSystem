// khaltiRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Your Khalti secret key (for test mode use your test key)
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'test_secret_key';

// POST /khalti/verify
// This endpoint will be called from the frontend with a Khalti payment token.
// It will verify the payment and (if successful) update the user's subscription.
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  
  // For a monthly subscription, 500 NPR is charged.
  // Khalti expects the amount in paisa (i.e. 1 NPR = 100 paisa).
  const amount = 500 * 100; // 500 NPR = 50000 paisa

  try {
    const url = 'https://khalti.com/api/v2/payment/verify/';
    const payload = {
      token,
      amount
    };
    
    // Make the POST request to Khalti's verification endpoint
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Simulate successful verification in test mode
    console.log('Khalti verification response:', response.data);

    // Here you can update your user's subscription status in your database
    // For example: set subscriptionActive = true and record the expiry date (e.g., one month from now)

    res.json({
      message: 'Payment verified. Subscription activated for 1 month.',
      data: response.data
    });
  } catch (error) {
    console.error('Khalti verification failed:', error.response ? error.response.data : error.message);
    res.status(400).json({
      message: 'Payment verification failed.',
      error: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
