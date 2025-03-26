const express = require("express");
const moment = require("moment");
const router = express.Router();
const TruckSchedule = require("../models/TruckSchedule");

const calculateScheduleStatus = (schedule) => {
  const currentDate = moment(); // Current time
  const scheduleDate = moment(schedule.date, "YYYY-MM-DD");
  const pickupTime = moment(schedule.date + " " + schedule.time, "YYYY-MM-DD h A"); // Pickup time
  const noonTime = scheduleDate.clone().hour(12).minute(0).second(0); // 12 PM of schedule day

  const dayOfWeek = moment(schedule.date, "YYYY-MM-DD").format("dddd"); // e.g., "Monday", "Tuesday", etc.
    schedule.day = dayOfWeek;
    schedule.save();

  let status = "Scheduled"; // Default status

  // If the current date is past the scheduled date, mark as "Completed"
  if (currentDate.isAfter(scheduleDate, "day")) {
    status = "Completed";
  } 
  // If today is the schedule day but it's after 12 PM, also mark as "Completed"
  else if (currentDate.isSame(scheduleDate, "day") && currentDate.isSameOrAfter(noonTime)) {
    status = "Completed";
  } 
  // If today is the schedule day but before 12 PM, mark as "Today's Collection"
  else if (currentDate.isSame(scheduleDate, "day") && currentDate.isBefore(noonTime)) {
    status = "Today's Collection"; 
  }

  return status;
};

// Function to update schedule status dynamically in the database
const updateSaturdaySchedule = async (schedule) => {
    const currentDate = moment();
    const scheduleDate = moment(schedule.date, "YYYY-MM-DD");
  
    // Update the date to the same day next week
    const updatedDate = scheduleDate.add(1, "week").format("YYYY-MM-DD");
    schedule.date = updatedDate; // Update the schedule with the new date
  
    // Update the day field based on the new date
    schedule.day = moment(updatedDate, "YYYY-MM-DD").format("dddd");
  
    // Change status to "Scheduled" only on Saturday
    if (schedule.status !== "Scheduled") {
      schedule.status = "Scheduled";
    }
  
    // Save the updated schedule with both date and day fields
    await schedule.save();
    console.log(
      `Schedule with wasteType: ${schedule.wasteType} updated on Saturday: status: Scheduled, date: ${schedule.date}, day: ${schedule.day}`
    );
  };
  
  const updateScheduleStatus = async () => {
    try {
      const schedules = await TruckSchedule.find();
      schedules.forEach(async (schedule) => {
        const currentDate = moment();
  
        // Only run Saturday logic if it's Saturday
        if (currentDate.day() === 6) {
          await updateSaturdaySchedule(schedule);  // Call the Saturday update function
        } else {
          // Update status for the current week (if not Saturday)
          const updatedStatus = calculateScheduleStatus(schedule);
          if (schedule.status !== updatedStatus) {
            schedule.status = updatedStatus;
            schedule.day = moment(schedule.date, "YYYY-MM-DD").format("dddd"); // Update day based on schedule date
            await schedule.save();
            console.log(
              `Schedule with wasteType: ${schedule.wasteType} updated: status: ${updatedStatus}, day: ${schedule.day}`
            );
          }
        }
      });
      console.log("Schedule statuses updated successfully.");
    } catch (error) {
      console.log("Error updating schedule statuses:", error);
    }
  };
  

  

// Set an interval to update schedule status every minute (60000 ms)
setInterval(updateScheduleStatus, 60000);

// GET all truck schedules, with optional filtering by day(s)
// e.g., GET /?days=sunday,monday
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.days) {
      // Expecting a comma-separated list of days
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
router.get("/:wasteType", async (req, res) => {
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

// POST (Create) a new truck schedule
router.post("/", async (req, res) => {
  const { day, wasteType, time, date, status } = req.body;
  const newSchedule = new TruckSchedule({ day, wasteType, time, date, status });
  try {
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (Update) an existing truck schedule by wasteType
router.put("/:wasteType", async (req, res) => {
  try {
    const updatedSchedule = await TruckSchedule.findOneAndUpdate(
      { wasteType: req.params.wasteType },
      req.body,
      { new: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found for the given wasteType" });
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
