const express = require("express");
const moment = require("moment");
const router = express.Router();
const TruckSchedule = require("../models/TruckSchedule");

// Helper function: given a day (e.g. "monday"), return the next occurrence's date
const getNextDateForDay = (dayString) => {
  const days = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };
  const targetDay = days[dayString.toLowerCase()];
  let result = moment().day(targetDay);
  // If that day is before today (or today already passed), add 7 days to get the next occurrence
  if (result.isBefore(moment(), "day")) {
    result.add(7, "days");
  }
  return result.format("YYYY-MM-DD");
};

// Function to calculate status based on date and time
const calculateScheduleStatus = (schedule) => {
  const currentTime = moment(); 
  const scheduleDate = moment(schedule.date, "YYYY-MM-DD");
  const noonTime = scheduleDate.clone().hour(12).minute(0).second(0);

  let status = "Scheduled";
  if (currentTime.isAfter(scheduleDate, "day")) {
    status = "Completed";
  } else if (currentTime.isSame(scheduleDate, "day")) {
    status = currentTime.isBefore(noonTime) ? "Today's Collection" : "Completed";
  }
  return status;
};

// Function to update all schedules dynamically
const updateScheduleStatus = async () => {
  const currentTime = moment();

  try {
    const schedules = await TruckSchedule.find();

    schedules.forEach(async (schedule) => {
      // First, fix the date if it doesn't match what the day says.
      // We'll use schedule.day (which is assumed to be the day name, e.g., "Monday").
      if (schedule.day) {
        const expectedDate = getNextDateForDay(schedule.day);
        if (schedule.date !== expectedDate) {
          schedule.date = expectedDate;
          schedule.day = moment(expectedDate, "YYYY-MM-DD").format("dddd");
          schedule.status = "Scheduled"; // Reset status when date is fixed.
          console.log(`Fixed date for ${schedule.wasteType}. New date: ${expectedDate}`);
          await schedule.save();
          // Continue to next schedule so that this run doesn’t update status based on an old date.
          return;
        }
      }

      // Now, update the status based on time of day.
      // If today is the schedule day...
      if (currentTime.isSame(moment(schedule.date, "YYYY-MM-DD"), "day")) {
        // At 11:59, update to next week.
        if (currentTime.hour() === 23 && currentTime.minute() === 59) {
          const newDate = moment(schedule.date, "YYYY-MM-DD").add(7, "days").format("YYYY-MM-DD");
          schedule.date = newDate;
          schedule.day = moment(newDate, "YYYY-MM-DD").format("dddd");
          schedule.status = "Scheduled";
          console.log(`Schedule for ${schedule.wasteType} updated to next week (${newDate}).`);
          await schedule.save();
          return;
        }
        
        // Otherwise, update status normally.
        const updatedStatus = calculateScheduleStatus(schedule);
        if (schedule.status !== updatedStatus) {
          schedule.status = updatedStatus;
          schedule.day = moment(schedule.date, "YYYY-MM-DD").format("dddd");
          console.log(`Status for ${schedule.wasteType} updated to: ${updatedStatus}`);
          await schedule.save();
        }
      } else {
        // For schedules not set for today: If the scheduled date is in the past, mark it as Completed.
        if (currentTime.isAfter(moment(schedule.date, "YYYY-MM-DD"), "day") && schedule.status !== "Completed") {
          schedule.status = "Completed";
          console.log(`Status for ${schedule.wasteType} marked as Completed (past date).`);
          await schedule.save();
        }
      }
    });

    console.log("Schedule statuses checked at", currentTime.format("HH:mm"));
  } catch (error) {
    console.log("Error updating schedule statuses:", error);
  }
};

// Automatically update schedule status every minute.
setInterval(updateScheduleStatus, 60000);

// GET all truck schedules, with optional filtering by day(s)
router.get("/all-schedules", async (req, res) => {
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

// POST (Create) a new truck schedule.
// The client sends a day (e.g., "Monday"), and we calculate the date accordingly.
router.post("/", async (req, res) => {
  try {
    const { wasteType, time, day, status } = req.body;
    if (!day) {
      return res.status(400).json({ message: "Day is required (e.g., Monday, Tuesday, etc.)." });
    }
    const date = getNextDateForDay(day);
    const formattedDay = moment(date, "YYYY-MM-DD").format("dddd");

    const newSchedule = new TruckSchedule({
      wasteType,
      time,
      date,
      day: formattedDay,
      status: status || "Scheduled"
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (Update) an existing truck schedule by ID.
// Allow updating the day; recalculate the date accordingly.
router.put("/:id", async (req, res) => {
  try {
    const { wasteType, time, day, status } = req.body;
    let updateData = { wasteType, time, status: status || "Scheduled" };

    if (day) {
      const date = getNextDateForDay(day);
      updateData.date = date;
      updateData.day = moment(date, "YYYY-MM-DD").format("dddd");
    }

    const updatedSchedule = await TruckSchedule.findByIdAndUpdate(
      req.params.id,
      updateData,
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
