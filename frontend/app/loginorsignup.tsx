import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { useRouter } from "expo-router";

export default function loginorsignup() {
  const router = useRouter();

  // Function to handle Signup button press, now it navigates to the sign-up page
  const handleSignup = () => {
    router.push("/SignUpScreen"); // Navigate to SignUp page
  };

  // Function to handle Login button press, now it navigates to the login page
  const handleLogin = () => {
    router.push("/login"); // Navigate to Login page
  };

  return (
    <View style={styles.container}>
      {/* Trees Image */}
      <Image
        source={require("../assets/images/Trees.png")}
        style={styles.trees}
        resizeMode="contain"
      />

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  trees: {
    width: 250,
    height: 120,
    marginBottom: 40,
  },
  buttonsContainer: {
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    paddingVertical: 10,
  },
  signupText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "bold",
  },
});
