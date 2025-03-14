const axios = require('axios');

const API_URL = 'http://localhost:5001/login'; // Your API endpoint

const runLoginTests = async () => {
    console.log("🚀 Running login tests...\n");

    // Test Valid Login
    try {
        const validResponse = await axios.post(API_URL, {
            email: 'testuser@example.com',     
            password: 'securePassword',      
        });

        console.log("Valid Login Test: Success!");
        console.log(validResponse.data);
    } catch (error) {
        console.log("Valid Login Test: Failed");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\n------------------------\n");

    // Test Invalid Login (Wrong Password)
    try {
        const invalidResponse = await axios.post(API_URL, {
            email: 'testuser@example.com',     // Existing user
            password: 'wrongPassword',        // Incorrect password
        });

        console.log("Invalid Login Test: Should Fail, but Passed");
        console.log(invalidResponse.data);
    } catch (error) {
        console.log("Invalid Login Test: Failed as expected");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\n------------------------\n");

    // 🟡 Test Empty Fields
    try {
        const emptyResponse = await axios.post(API_URL, {
            email: '',
            password: '',
        });

        console.log("Empty Fields Test: Should Fail, but Passed");
        console.log(emptyResponse.data);
    } catch (error) {
        console.log(" Empty Fields Test: Failed as expected");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\nAll tests complete!");
};

runLoginTests();
