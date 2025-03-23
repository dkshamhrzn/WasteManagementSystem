const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  Day: { type: String, required: true },
  Assignment: { type: String, required: true }
});

const truckScheduleSchema = new mongoose.Schema({
  truckNumber: { type: Number, required: true, unique: true },
  truckType: { type: String, required: true },
  schedule: [scheduleSchema]
});

module.exports = mongoose.model("TruckSchedule", truckScheduleSchema);
