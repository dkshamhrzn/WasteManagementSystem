import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";

// Login screen component for user and admin authentication
export default function Login() {
  const router = useRouter();

  // State variables for user inputs and UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handles login logic for both user and admin
  const handleLogin = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    setErrorMessage(""); // Reset any previous error messages

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Simple validation
    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Email and Password cannot be empty.");
      return;
    }

    // 🔐 Admin login shortcut (hardcoded)
    if (
      trimmedEmail.toLowerCase() === "admin123@gmail.com" &&
      trimmedPassword === "Admin123"
    ) {
      Alert.alert("Admin Login", "Welcome Admin!");
      setTimeout(() => router.replace("/adminDashboard"), 1); // Navigate to Admin Dashboard
      return;
    }

    // Start loading spinner
    setLoading(true);

    try {
      // Debug log: request payload
      console.log("Sending request with payload:", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // API call to login endpoint
      const response = await fetch("https://wastewise-app.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      // Debug log: response status and data
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setLoading(false); // Stop loading

      if (response.ok) {
        // ✅ Successful login
        Alert.alert("Success", data.message || "Login successful!");
        setTimeout(() => router.replace("/nopayhomepage"), 1); // Navigate to user homepage
      } else {
        // ❌ Handle error messages from backend
        if (data.message.includes("Invalid password")) {
          setErrorMessage("Invalid password. Please try again.");
        } else if (data.message.includes("Invalid email")) {
          setErrorMessage("Invalid email. Please check and try again.");
        } else {
          setErrorMessage("Invalid credentials. Please try again.");
        }
      }
    } catch (error) {
      // ❗ Handle unexpected errors (e.g., network issues)
      setLoading(false);
      setErrorMessage("Something went wrong. Please check your internet and try again.");
      console.error("API Error:", error);
    }
  };

  // 📱 UI rendering
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.formContainer}
        >
          {/* Title */}
          <Text style={styles.title}>
            Login to <Text style={styles.brand}>WasteWise</Text>
          </Text>

          {/* Display error if exists */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#666"
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#666"
          />

          {/* Forgot password link */}
          <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login button with spinner */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Link to sign-up screen */}
          <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
            <Text style={styles.createAccount}>Create a new account</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// 🎨 Styles for Login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "85%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  brand: {
    fontWeight: "bold",
    color: "#2E7D32",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
  },
  forgotPassword: {
    color: "#2E7D32",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#2E7D32",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccount: {
    color: "#2E7D32",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});
