import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const PaymentScreen = () => {
  const [email, setEmail] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = await SecureStore.getItemAsync("userEmail");
      const storedIsPaid = await SecureStore.getItemAsync("isPaid");

      if (storedEmail) setEmail(storedEmail);
      if (storedIsPaid === "true") setIsPaid(true);
    };

    fetchUserData();
  }, []);

  const handlePayment = async () => {
    try {
      console.log("Email being sent:", email); // Log email to confirm

      // Step 1: Open the payment link in the browser
      Linking.openURL("https://wastewise-app.onrender.com/initialpayment");

      // Step 2: Update payment status in the backend API
      const response = await fetch(
        "http://wastewise-app.onrender.com/api/payment/initial-payment",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        // Log the response from the backend for debugging
        console.log("Response from backend:", responseData);

        // Step 3: Check if payment status was updated to 'paid'
        if (responseData.updated.status === "paid") {
          // Update payment status in SecureStore and AsyncStorage
          await SecureStore.setItemAsync("isPaid", "true");
          await AsyncStorage.setItem("isPaid", "true");
          setIsPaid(true); // Update local state

          // Step 4: Alert user and navigate to homepage
          Alert.alert("Payment Status Updated", "Redirecting to Home...");
          router.push("/homepage");
        } else {
          // Handle failure response
          Alert.alert("Payment Failed", "Please try again later.");
        }
      } else {
        // If the backend response isn't successful, show an alert
        const errorText = await response.text();
        Alert.alert("Payment Failed", errorText || "Please try again later.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const navigateHome = () => {
  if (isPaid) {
    router.push("/homepage");
  } else {
    router.push("/nopayhomepage");
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.center}>
        {isPaid ? (
          <Text style={styles.message}>
            ✅ You’ve already completed the payment!
          </Text>
        ) : (
          <>
            <Text style={styles.message}>💰 Payment Required</Text>
            <TouchableOpacity onPress={handlePayment} style={styles.button}>
              <Text style={styles.buttonText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={navigateHome}>
          <Image
            source={require("../assets/images/Home.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/info")}
        >
          <Image
            source={require("../assets/images/Info.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/payment")}
        >
          <Image
            source={require("../assets/images/Coin.png")}
            style={[styles.navIcon, styles.activeNavIcon]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/profile")}
        >
          <Image
            source={require("../assets/images/User.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bottomNav: {
    height: 60,
    backgroundColor: "#D9EFD9",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    padding: 10,
  },
  navIcon: {
    width: 30,
    height: 30,
    tintColor: "green",
  },
  activeNavIcon: {
    tintColor: "darkgreen",
  },
});
