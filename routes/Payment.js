const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const KHALTI_SECRET_KEY = 'live_secret_key_68791341fdd94846a146f0457ff7b455';

// Khalti Payment Verification Route
router.post('/verify/khalti', async (req, res) => {
    const { token, amount } = req.body;

    try {
        const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, amount })
        });

        const data = await response.json();

        if (response.ok && data.idx) {
            res.json({ success: true, data });
        } else {
            res.status(400).json({ success: false, error: data });
        }
    } catch (error) {
        console.error('Error verifying Khalti payment:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
