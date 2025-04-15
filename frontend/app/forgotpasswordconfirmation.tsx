import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";

// Main component for OTP verification screen
export default function forgotpasswordconfirmation() {
  const router = useRouter(); // Router hook for navigation
  const [otp, setOtp] = useState(""); // State to store the OTP input value
  const [loading, setLoading] = useState(false); // State to manage loading state

  // Function to handle OTP verification when the user submits the OTP
  const handleOtpVerification = async () => {
    // Ensure OTP is 6 digits long
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true); // Set loading to true to show the spinner

    try {
      // Send OTP to the server for verification
      const response = await fetch("https://wastewise-app.onrender.com/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otp }), // Send OTP as the request body
      });

      const data = await response.json(); // Parse the server response
      setLoading(false); // Set loading to false after response is received

      // Check if the response was successful
      if (response.ok) {
        Alert.alert("Success", data.message || "OTP verified successfully!");
        // Navigate to the reset password screen, passing the OTP as a parameter
        router.push({ pathname: "/resetpassword", params: { token: otp } });
      } else {
        // Handle error if OTP verification fails
        Alert.alert("Error", data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      setLoading(false); // Set loading to false in case of error
      console.error("OTP API Error:", error); // Log the error for debugging
      Alert.alert("Error", "Network error. Please try again."); // Show a network error alert
    }
  };

  return (
    // Dismiss the keyboard when the user taps outside the input area
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Title of the page */}
        <Text style={styles.title}>Email Sent</Text>

        {/* Message box informing the user to check their email */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Please check your email inbox for the OTP to complete the verification.
          </Text>
        </View>

        {/* OTP input field */}
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#999"
          value={otp}
          onChangeText={(text) => {
            // Only allow numeric input (digits only)
            const digitsOnly = text.replace(/[^0-9]/g, "");
            if (digitsOnly.length <= 6) {
              setOtp(digitsOnly); // Update OTP state with valid digits
            }
          }}
          keyboardType="number-pad" // Show numeric keypad
          maxLength={6} // Limit input length to 6 characters
          autoCapitalize="none" // Disable auto capitalization
          autoCorrect={false} // Disable auto-correction
        />

        {/* Button to trigger OTP verification */}
        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.disabledButton]} // Disable button when loading
          onPress={handleOtpVerification} // Call handleOtpVerification on press
          disabled={loading} // Disable the button while loading
        >
          {/* Show loading spinner while OTP is being verified */}
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.verifyButtonText}>Verify OTP</Text>}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 16, fontWeight: "500", marginBottom: 20 },
  messageBox: {
    backgroundColor: "#D4EED6",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  messageText: { fontSize: 14, color: "#3B7D44", textAlign: "center" },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#000",
  },
  verifyButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  verifyButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  disabledButton: { opacity: 0.7 }, // Reduce opacity of the button when disabled
});
