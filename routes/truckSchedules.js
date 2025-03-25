const express = require("express");
const moment = require("moment");
const router = express.Router();
const TruckSchedule = require("../models/TruckSchedule");

const calculateScheduleStatus = (schedule) => {
  const currentDate = moment(); // Current time
  const scheduleDate = moment(schedule.date, "YYYY-MM-DD");
  const pickupTime = moment(schedule.date + " " + schedule.time, "YYYY-MM-DD h A"); // Pickup time
  const noonTime = scheduleDate.clone().hour(12).minute(0).second(0); // 12 PM of schedule day

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

// Function to update schedule status dynamically and handle date change
const updateScheduleStatus = async () => {
  try {
    const schedules = await TruckSchedule.find();
    schedules.forEach(async (schedule) => {
      // Check if the schedule date is in the past and update it to the next week
      const currentDate = moment();
      const scheduleDate = moment(schedule.date, "YYYY-MM-DD");
      
      if (currentDate.isAfter(scheduleDate, "day")) {
        // Update the date to the same day next week
        const updatedDate = scheduleDate.add(1, 'week').format("YYYY-MM-DD");
        schedule.date = updatedDate;  // Update the schedule with the new date
      }

      const updatedStatus = calculateScheduleStatus(schedule);
      if (schedule.status !== updatedStatus) {
        schedule.status = updatedStatus;
        await schedule.save();  // Save the updated status and potentially the new date
        console.log(`Schedule with wasteType: ${schedule.wasteType} updated to status: ${updatedStatus} and date: ${schedule.date}`);
      }
    });
    console.log("Schedule statuses and dates updated successfully.");
  } catch (error) {
    console.log("Error updating schedule statuses:", error);
  }
};

// Set an interval to update schedule status every minute (60000 ms)
setInterval(updateScheduleStatus, 60000);

module.exports = router;
