const express = require("express");
const router = express.Router();
const TruckSchedule = require("../models/TruckSchedule");

// GET all truck schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await TruckSchedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific truck schedule by truckNumber
router.get("/:truckNumber", async (req, res) => {
  try {
    const schedule = await TruckSchedule.findOne({ truckNumber: req.params.truckNumber });
    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST (Create) a new truck schedule
router.post("/", async (req, res) => {
  const { truckNumber, truckType, schedule } = req.body;
  const newSchedule = new TruckSchedule({ truckNumber, truckType, schedule });
  try {
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (Update) an existing truck schedule
router.put("/:truckNumber", async (req, res) => {
  try {
    const updatedSchedule = await TruckSchedule.findOneAndUpdate(
      { truckNumber: req.params.truckNumber },
      req.body,
      { new: true }
    );
    if (!updatedSchedule)
      return res.status(404).json({ message: "Schedule not found" });
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a truck schedule
router.delete("/:truckNumber", async (req, res) => {
  try {
    const deletedSchedule = await TruckSchedule.findOneAndDelete({ truckNumber: req.params.truckNumber });
    if (!deletedSchedule)
      return res.status(404).json({ message: "Schedule not found" });
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
