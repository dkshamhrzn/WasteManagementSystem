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

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://wastewise-app.onrender.com/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message || "Password reset link sent to your email.");
        router.push("/forgotPasswordConfirmation"); // Navigate to confirmation screen
      } else {
        Alert.alert("Error", data.error || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={require("../assets/images/Thinking.png")} style={styles.image} />
        <Text style={styles.title}>Forgot your Password?</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.backToSignIn}>Back to sign in</Text>
        </TouchableOpacity>
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
        <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
          <Text style={styles.createAccount}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
    backgroundColor: "#A5D6A7", // Lighter green when disabled
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