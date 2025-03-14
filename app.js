const express = require("express");
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser");
const Role = require("./models/UserRoleSchema");
const signupRouter = require("./routes/Signup");  // Import the signup route
const loginRouter = require("./routes/Login");  // Import the signup route

const app = express();
app.use(bodyParser.json());

const mongooseURL = "mongodb+srv://wastewise:BdvheLPluzRPwfxr@cluster0.5r3mk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongooseURL) 
    .then(() => {
        console.log("MongoDB connected");

        // Add roles if they don't exist
        Role.findOne({ role_name: 'admin' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'admin' });
                console.log("Admin role created.");
            }
        });

        Role.findOne({ role_name: 'user' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'user' });
                console.log("User role created.");
            }
        });

        Role.findOne({ role_name: 'driver' }).then(role => {
            if (!role) {
                Role.create({ role_name: 'driver' });
                console.log("Driver role created.");
            }
        });
    })
    .catch((err) => console.log("MongoDB connection error:", err));

// Use the signup route
app.use('/signup', signupRouter);  // Now the signup route should be accessible at http://localhost:5001/signup
app.use('/login', loginRouter);  // Now the signup route should be accessible at http://localhost:5001/signup

// Start the server
app.listen(5001, () => {
    console.log("Server running on port 5001");
});
