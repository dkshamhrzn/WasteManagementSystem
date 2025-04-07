const mongoose = require("mongoose");
const moment = require("moment");

const truckScheduleSchema = new mongoose.Schema({
    wasteType: { type: String },
    time: { type: String },
    date: { type: String, required: true },
    status: { type: String, required: true },
    day: { type: String } // This will be auto-calculated
});

// Middleware to auto-calculate the day before saving
truckScheduleSchema.pre("save", function (next) {
    if (this.date) {
        const dateObj = new Date(this.date);
        this.day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    }
    next();
});

const TruckSchedule = mongoose.model("TruckSchedule", truckScheduleSchema);

module.exports = TruckSchedule;
