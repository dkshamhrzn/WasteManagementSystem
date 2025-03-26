const mongoose = require("mongoose");
const moment = require("moment");

const truckScheduleSchema = new mongoose.Schema({
    wasteType: { type: String },
    time: { type: String },
    date: { type: String, required: true },
    status: { type: String, required: true },
    day: { type: String } // This will be auto-calculated
});

// Middleware to calculate day from date before saving
truckScheduleSchema.pre("save", function (next) {
    if (this.date) {
        this.day = moment(this.date, "YYYY-MM-DD").format("dddd");
    }
    next();
});

const TruckSchedule = mongoose.model("TruckSchedule", truckScheduleSchema);

module.exports = TruckSchedule;
