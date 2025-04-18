const express = require("express");
const axios = require("axios");
const router = express.Router();

// Initiate payment
router.post("/initiate-payment", async (req, res) => {
  const {
    return_url,
    amount,
    purchase_order_id,
    product_name,
    customer_name,
    customer_email,
    customer_phone,
    gateway,
  } = req.body;

  // Validate fields
  if (
    !return_url ||
    !amount ||
    !purchase_order_id ||
    !product_name ||
    !customer_name ||
    !customer_email ||
    !customer_phone ||
    !gateway
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Basic validation
  if (!return_url.startsWith("http://") && !return_url.startsWith("https://")) {
    return res.status(400).json({ error: "Invalid return_url" });
  }
  if (!Number.isInteger(Number(amount)) || amount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive integer" });
  }
  if (typeof purchase_order_id !== "string" || purchase_order_id.trim() === "") {
    return res.status(400).json({ error: "Invalid purchase_order_id" });
  }
  if (typeof product_name !== "string" || product_name.trim() === "") {
    return res.status(400).json({ error: "Invalid product_name" });
  }
  if (typeof customer_name !== "string" || customer_name.trim() === "") {
    return res.status(400).json({ error: "Invalid customer_name" });
  }
  if (!customer_email.includes("@") || !customer_email.includes(".")) {
    return res.status(400).json({ error: "Invalid customer_email" });
  }
  if (typeof customer_phone !== "string" || customer_phone.trim() === "") {
    return res.status(400).json({ error: "Invalid customer_phone" });
  }
  if (!["khalti", "esewa"].includes(gateway)) {
    return res.status(400).json({ error: "Invalid gateway specified" });
  }

  // Select API key and gateway URL
  let apiKey, gatewayUrl;
  if (gateway === "khalti") {
    apiKey = "live_secret_key_68791341fdd94846a146f0457ff7b455";
    gatewayUrl = "https://a.khalti.com/api/v2/epayment/initiate/";
  } else {
    apiKey = "8gBm/:&EnhH.1/q";
    gatewayUrl = "https://uat.esewa.com.np/epay/main";
  }

  try {
    // Khalti payload
    let payload = {
      return_url,
      amount,
      purchase_order_id,
      purchase_order_name: product_name,
      customer_info: {
        name: customer_name,
        email: customer_email,
        phone: customer_phone,
      },
    };

    // eSewa payload
    if (gateway === "esewa") {
      payload = {
        product_code: "EPAYTEST",
        total_amount: amount,
        transaction_uuid: purchase_order_id,
        success_url: return_url,
        failure_url: return_url,
      };
    }

    const response = await axios.post(gatewayUrl, payload, {
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Payment initiation error:",
      error.response?.data,
      error.response?.status,
      error.message
    );
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Payment callback
router.get("/callback", async (req, res) => {
  const { pidx, status, transaction_id } = req.query;
  try {
    console.log(`Callback received: pidx=${pidx}, status=${status}, transaction_id=${transaction_id}`);
    res.send(`Payment callback: pidx=${pidx}, status=${status}`);
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).send("Callback error");
  }
});

module.exports = router;