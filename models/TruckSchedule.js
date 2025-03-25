const mongoose = require("mongoose");

const truckScheduleSchema = new mongoose.Schema({
    day: { type: String, required: true },
    wasteType: { type: String },
    time: { type: String },
    date: { type: String, required: true },
    status: { type: String, required: true },
});

const TruckSchedule = mongoose.model("TruckSchedule", truckScheduleSchema);

module.exports = TruckSchedule;
