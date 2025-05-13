import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";

const SignUpScreen = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const fetchAddressSuggestions = async (query: string | any[]) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await response.json();
      setAddressSuggestions(data.map((item: { display_name: any; }) => item.display_name));
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleSignup = async () => {
    Keyboard.dismiss();

    if (!fullName || !phone || !email || !password || !address) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setProgress(true);

    try {
      const requestBody = JSON.stringify({
        full_name: fullName,
        email,
        phone_number: phone,
        password,
        address,
        role_name: "user", // default user role
      });

      const response = await fetch("https://wastewise-app.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      const data = await response.json();
      setLoading(false);
      setProgress(false);

      if (response.ok) {
        Alert.alert("Success", "Signup complete! Redirecting to home...", [
          { text: "OK", onPress: () => router.push("/login") }, // Navigate to the login page
        ]);
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      setLoading(false);
      setProgress(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Removed LinearGradient, now using solid white background */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            Signup to <Text style={styles.brand}>WasteWise</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
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

          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              fetchAddressSuggestions(text);
            }}
            placeholderTextColor="#666"
          />

          {addressSuggestions.length > 0 && (
            <FlatList
              data={addressSuggestions}
              keyExtractor={(item, index) => index.toString()}
              style={styles.suggestionsList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setAddress(item);
                    setAddressSuggestions([]);
                  }}
                >
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Signup</Text>
            )}
          </TouchableOpacity>

          {progress && <ActivityIndicator size="large" color="#2E7D32" style={styles.progressIndicator} />}

          <TouchableOpacity onPress={() => router.push("/login")} style={styles.createAccount}>
            <Text>
              Already have an account? <Text style={styles.forgotPassword}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Solid white background
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
  suggestionsList: {
    width: "100%",
    backgroundColor: "#FFF",
    maxHeight: 120,
    borderRadius: 10,
    elevation: 2,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  progressIndicator: {
    marginTop: 10,
  },
});

export default SignUpScreen;
