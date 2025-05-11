const axios = require("axios");

const API_URL = "http://localhost:5001/signup"; // Your API endpoint

const runSignupTests = async () => {
    console.log("Running signup tests...\n");

    // Valid Signup Test
    try {
        const validResponse = await axios.post(API_URL, {
            full_name: "Test User",
            email: "testuser@example.com",         
            phone_number: "9834567890",
            password: "securePassword",
            address: "123 Test address",
            role_name: "user",
        });

        console.log("Valid Signup Test: Success!");
        console.log(validResponse.data);
    } catch (error) {
        console.log("Valid Signup Test: Failed");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\n------------------------\n");

    // Duplicate Email Test
    try {
        const duplicateEmailResponse = await axios.post(API_URL, {
            full_name: "Test User",
            email: "testuser@example.com",         // Same email
            phone_number: "9834567890",
            password: "securePassword",
            address: "123 Test address",
            role_name: "user",
        });

        console.log("Duplicate Email Test: Should Fail, but Passed?");
        console.log(duplicateEmailResponse.data);
    } catch (error) {
        console.log("Duplicate Email Test: Failed as expected");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\n------------------------\n");

    // Invalid Role Test
    try {
        const invalidRoleResponse = await axios.post(API_URL, {
            full_name: "Test User",
            email: "invalidrole@example.com",
            phone_number: "9834567890",
            password: "securePassword",
            address: "123 Test address",
            role_name: "invalidRole",              // Invalid role
        });

        console.log("Invalid Role Test: Should Fail, but Passed?");
        console.log(invalidRoleResponse.data);
    } catch (error) {
        console.log("Invalid Role Test: Failed as expected");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\n------------------------\n");

    // Invalid Email Test
    try {
        const invalidEmailResponse = await axios.post(API_URL, {
            full_name: "Test User",
            email: "invalid-email",               // Invalid email
            phone_number: "9834567890",
            password: "securePassword",
            address: "123 Test address",
            role_name: "user",
        });

        console.log("Invalid Email Test: Should Fail, but Passed?");
        console.log(invalidEmailResponse.data);
    } catch (error) {
        console.log("Invalid Email Test: Failed as expected");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\n------------------------\n");

    // Invalid Phone Number Test
    try {
        const invalidPhoneResponse = await axios.post(API_URL, {
            full_name: "Test User",
            email: "phoneinvalid@example.com",
            phone_number: "1234567890",           // Invalid phone number
            password: "securePassword",
            address: "123 Test address",
            role_name: "user",
        });

        console.log("Invalid Phone Test: Should Fail, but Passed?");
        console.log(invalidPhoneResponse.data);
    } catch (error) {
        console.log("Invalid Phone Test: Failed as expected");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\n------------------------\n");

    // Empty Fields Test
    try {
        const emptyFieldsResponse = await axios.post(API_URL, {
            full_name: "",
            email: "",
            phone_number: "",
            password: "",
            address: "",
            role_name: "",
        });

        console.log("Empty Fields Test: Should Fail, but Passed?");
        console.log(emptyFieldsResponse.data);
    } catch (error) {
        console.log("Empty Fields Test: Failed as expected");
        console.log(error.response ? error.response.data : error.message);
    }

    console.log("\nAll signup tests complete!");
};

runSignupTests();
