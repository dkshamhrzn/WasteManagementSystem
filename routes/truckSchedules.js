const express = require("express");
const moment = require("moment");
const router = express.Router();
const TruckSchedule = require("../models/TruckSchedule");

// Function to calculate status based on date and time
const calculateScheduleStatus = (schedule) => {
  const currentDate = moment(); 
  const scheduleDate = moment(schedule.date, "YYYY-MM-DD");
  const noonTime = scheduleDate.clone().hour(12).minute(0).second(0);

  let status = "Scheduled";

  if (currentDate.isAfter(scheduleDate, "day")) {
    status = "Completed";
  } else if (currentDate.isSame(scheduleDate, "day") && currentDate.isSameOrAfter(noonTime)) {
    status = "Completed";
  } else if (currentDate.isSame(scheduleDate, "day") && currentDate.isBefore(noonTime)) {
    status = "Today's Collection";
  }

  return status;
};

// Function to update Saturday schedules
const updateSaturdaySchedule = async (schedule) => {
  const scheduleDate = moment(schedule.date, "YYYY-MM-DD");
  const updatedDate = scheduleDate.add(1, "week").format("YYYY-MM-DD");

  schedule.date = updatedDate;
  schedule.day = moment(updatedDate, "YYYY-MM-DD").format("dddd");
  schedule.status = "Scheduled";

  await schedule.save();
};

// Function to update all schedules dynamically
const updateScheduleStatus = async () => {
  try {
    const schedules = await TruckSchedule.find();
    schedules.forEach(async (schedule) => {
      const currentDate = moment();

      if (currentDate.day() === 6) {
        await updateSaturdaySchedule(schedule);
      } else {
        const updatedStatus = calculateScheduleStatus(schedule);
        if (schedule.status !== updatedStatus) {
          schedule.status = updatedStatus;
          schedule.day = moment(schedule.date, "YYYY-MM-DD").format("dddd");
          await schedule.save();
        }
      }
    });
    console.log("Schedule statuses updated successfully.");
  } catch (error) {
    console.log("Error updating schedule statuses:", error);
  }
};

// Automatically update schedule status every minute
setInterval(updateScheduleStatus, 60000);

// GET all truck schedules, with optional filtering by day(s)
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.days) {
      const daysArray = req.query.days.split(",").map(day => day.trim().toLowerCase());
      filter.day = { $in: daysArray };
    }
    const schedules = await TruckSchedule.find(filter);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific truck schedule by wasteType
router.get("/wasteType/:wasteType", async (req, res) => {
    try {
      const schedule = await TruckSchedule.find({ wasteType: req.params.wasteType });
      if (schedule.length === 0) {
        return res.status(404).json({ message: "Schedule not found for the given wasteType" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // GET a specific truck schedule by id
  router.get("/id/:id", async (req, res) => {
      try {
        const schedule = await TruckSchedule.findById(req.params.id);  // Using findById to find by ID
    
        if (!schedule) {
          return res.status(404).json({ message: "Schedule not found for the given ID" });
        }
    
        res.json(schedule);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  });
  
  
// POST (Create) a new truck schedule
router.post("/", async (req, res) => {
  try {
    const { wasteType, time, date, status } = req.body;
    const day = moment(date, "YYYY-MM-DD").format("dddd");

    const newSchedule = new TruckSchedule({
      wasteType,
      time,
      date,
      day,
      status: status || "Scheduled"
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (Update) an existing truck schedule by ID, including wasteType, time, and date
router.put("/:id", async (req, res) => {
  try {
    const { wasteType, time, date, status } = req.body;

    const updatedSchedule = await TruckSchedule.findByIdAndUpdate(
      req.params.id,
      {
        wasteType,
        time,
        date,
        day: moment(date, "YYYY-MM-DD").format("dddd"), // Auto-update day
        status: status || "Scheduled"
      },
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found for the given ID" });
    }

    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a truck schedule by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedSchedule = await TruckSchedule.findByIdAndDelete(req.params.id);

    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found for the given ID" });
    }

    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
