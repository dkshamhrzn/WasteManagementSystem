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

export default function ForgotPasswordConfirmation() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://wastewise-app.onrender.com/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otp }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.message || "OTP verified successfully!");
        router.push({ pathname: "/resetpassword", params: { token: otp } }); // Passing token
      } else {
        Alert.alert("Error", data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      setLoading(false);
      console.error("OTP API Error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Email Sent</Text>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Please check your email inbox for the OTP to complete the verification.
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#999"
          value={otp}
          onChangeText={(text) => {
            const digitsOnly = text.replace(/[^0-9]/g, ""); // only numbers
            if (digitsOnly.length <= 6) {
              setOtp(digitsOnly);
            }
          }}
          keyboardType="number-pad"
          maxLength={6}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.disabledButton]}
          onPress={handleOtpVerification}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.verifyButtonText}>Verify OTP</Text>}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
  disabledButton: { opacity: 0.7 },
});
