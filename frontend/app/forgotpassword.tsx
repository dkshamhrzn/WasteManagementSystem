import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

// Forgot Password screen component
export default function forgotpassword() {
  const router = useRouter(); // Hook to navigate between screens
  const [email, setEmail] = useState(""); // State to store user's email input
  const [loading, setLoading] = useState(false); // State to show loading indicator during async request

  // Handles the Send button click
  const handleSend = async () => {
    // Validate that email is not empty
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      // Send POST request to backend to initiate password reset
      const response = await fetch("https://wastewise-app.onrender.com/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Handle success response
      if (response.ok) {
        Alert.alert("Success", data.message || "Password reset link sent to your email.");
        router.push("/forgotpasswordconfirmation"); // Navigate to confirmation screen
      } else {
        // Handle server-side error response
        Alert.alert("Error", data.error || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      // Catch and handle network or unexpected errors
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Main UI rendering
  return (
    // Dismiss keyboard when tapping outside the input
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Display logo or illustration */}
        <Image source={require("../assets/images/Thinking.png")} style={styles.image} />

        {/* Title text */}
        <Text style={styles.title}>Forgot your Password?</Text>

        {/* Email input field */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#666"
        />

        {/* Navigate back to login screen */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.backToSignIn}>Back to sign in</Text>
        </TouchableOpacity>

        {/* Send button with loading indicator */}
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.disabledButton]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>

        {/* Navigate to sign up screen */}
        <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
          <Text style={styles.createAccount}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles for the Forgot Password screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#2E7D32",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
  },
  backToSignIn: {
    color: "#8BC34A",
    fontSize: 14,
    marginBottom: 15,
  },
  sendButton: {
    width: "100%",
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7", // Light green when button is disabled/loading
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccount: {
    color: "#2E7D32",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
