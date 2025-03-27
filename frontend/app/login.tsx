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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    setErrorMessage("");
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Email and Password cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // Log the request payload for debugging
      console.log("Sending request with payload:", { email: trimmedEmail, password: trimmedPassword });

      // Make API call to login
      const response = await fetch("https://wastewise-app.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      // Log the response status and data for debugging
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setLoading(false);

      if (response.ok) {
        // Login successful
        Alert.alert("Success", data.message || "Login successful!");
        setTimeout(() => router.replace("/homepage"), 500); // Navigate to homepage after a delay
      } else {
        // Login failed
        if (data.message.includes("Invalid password")) {
          setErrorMessage("Invalid password. Please try again.");
        } else if (data.message.includes("Invalid email")) {
          setErrorMessage("Invalid email. Please check and try again.");
        } else {
          setErrorMessage("Invalid credentials. Please try again.");
        }
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Something went wrong. Please check your internet and try again.");
      console.error("API Error:", error); // Log the error for debugging
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formContainer}>
          <Text style={styles.title}>Login to <Text style={styles.brand}>WasteWise</Text></Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={email} 
            onChangeText={setEmail} 
            placeholderTextColor="#666" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
            placeholderTextColor="#666" 
          />
          <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.loginButton, loading && styles.disabledButton]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/SignUpScreen")}> 
            <Text style={styles.createAccount}>Create a new account</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  formContainer: { 
    width: "85%" 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "600", 
    marginBottom: 20, 
    color: "#333", 
    textAlign: "center" 
  },
  brand: { 
    fontWeight: "bold", 
    color: "#2E7D32" 
  },
  input: { 
    width: "100%", 
    height: 50, 
    borderColor: "#DDD", 
    borderWidth: 1, 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginBottom: 12, 
    backgroundColor: "#F9F9F9" 
  },
  forgotPassword: { 
    color: "#2E7D32", 
    fontSize: 14, 
    textAlign: "center", 
    marginBottom: 10 
  },
  loginButton: { 
    width: "100%", 
    backgroundColor: "#2E7D32", 
    paddingVertical: 15, 
    borderRadius: 25, 
    alignItems: "center", 
    marginTop: 10 
  },
  disabledButton: { 
    opacity: 0.7 
  },
  loginButtonText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  createAccount: { 
    color: "#2E7D32", 
    fontSize: 14, 
    textAlign: "center", 
    marginTop: 10 
  },
  errorText: { 
    color: "red", 
    fontSize: 14, 
    textAlign: "center", 
    marginBottom: 10 
  },
});