const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");

// ========== USER: Submit Pickup Request ==========
router.post("/", async (req, res) => {
    try {
        const {
            waste_type,
            quantity,
            location,
            preferred_date,
            preferred_time,
            notes,
            user_email
        } = req.body;

        if (!waste_type || quantity == null || !location || !preferred_date || !preferred_time || !user_email) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const numericQuantity = parseFloat(quantity);
        if (isNaN(numericQuantity)) {
            return res.status(400).json({ message: "Quantity must be a valid number" });
        }

        // Sample price estimation logic based on waste type
        let ratePerUnit = 0;
        switch (waste_type.toLowerCase()) {
            case "nondegradable":
                ratePerUnit = 5;
                break;
            case "biodegradable":
                ratePerUnit = 3;
                break;
            case "recyclable":
                ratePerUnit = 10;
                break;
            default:
                ratePerUnit = 2; // default rate
        }

        const estimated_price = numericQuantity * ratePerUnit;

        const pickup = new PickupRequest({
            waste_type,
            quantity: numericQuantity,
            location,
            preferred_date,
            preferred_time,
            notes,
            user_email,
            estimated_price
        });

        await pickup.save();

        res.status(201).json({ message: "Pickup request submitted", pickup });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit pickup request", error: error.message });
    }
});

// ========== ADMIN: View All Pending Requests ==========
router.get("/admin/requests", async (req, res) => {
    try {
        const pendingRequests = await PickupRequest.find({ status: "Pending" });
        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch requests", error: error.message });
    }
});

// ========== ADMIN: Approve or Reject Request ==========
router.put("/admin/requests/:id/decision", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_confirmed_date, admin_confirmed_time } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'" });
        }

        const update = {
            status,
            admin_confirmed_date: admin_confirmed_date || null,
            admin_confirmed_time: admin_confirmed_time || null,
        };

        const updatedRequest = await PickupRequest.findByIdAndUpdate(id, update, { new: true });

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.json({ message: `Request ${status.toLowerCase()}`, request: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: "Failed to update request", error: error.message });
    }
});

// ========== USER: View Approved Requests ==========
router.get("/user/requests/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const requests = await PickupRequest.find({ user_email: email });

        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: "No requests found for this user" });
        }

        const now = new Date();

        const updatedRequests = await Promise.all(requests.map(async req => {
            const finalDate = req.admin_confirmed_date || req.preferred_date;
            const finalTime = req.admin_confirmed_time || req.preferred_time;

            const scheduledDateTime = new Date(`${finalDate} ${finalTime}`);

            if ((req.status === "Approved" || req.status === "Rejected") && now > scheduledDateTime) {
                req.status = "Complete";
                await req.save();
            }

            let statusMessage = "";
            if (req.status === "Approved") {
                statusMessage = `Your request is approved for ${finalDate} at ${finalTime}`;
            } else if (req.status === "Rejected") {
                statusMessage = "Your request was rejected by admin";
            } else if (req.status === "Complete") {
                statusMessage = "Pickup has been completed";
            } else {
                statusMessage = "Your request is pending approval";
            }

            return {
                ...req.toObject(),
                final_date: finalDate,
                final_time: finalTime,
                user_status_message: statusMessage,
            };
        }));

        res.json(updatedRequests);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user requests", error: error.message });
    }
});

module.exports = router;
