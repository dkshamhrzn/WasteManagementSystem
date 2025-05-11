const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    phone_number: {
        type: String,
        required: true,
        match: [/^98\d{8}$/, "Phone number must start with 98 and be 10 digits long"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role", // Reference to Role collection
        required: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    verificationStatus: {
        type: Boolean,
        default: false, 
    },
    // Fields for password reset functionality
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiration: {
        type: Date,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    }
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
