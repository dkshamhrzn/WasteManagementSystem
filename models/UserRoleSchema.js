const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate role names
        enum: ['admin', 'user', 'driver'], 
    }
});

// Create the Role model
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
