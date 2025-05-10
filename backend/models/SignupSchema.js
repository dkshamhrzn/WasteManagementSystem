const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User collection
        required: true,
    },
    registration_date: {
        type: Date,
        default: Date.now, // Automatically set to the current date when creating the signup
    },
    verification_status: {
        type: Boolean,
        default: false, // By default, the account is not verified
    },
});

// Create the Signup model
const Signup = mongoose.model("Signup", signupSchema);

module.exports = Signup;
