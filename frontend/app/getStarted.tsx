import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";


export default function getstarted() {
  const router = useRouter(); // Initialize navigation
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate slogan first
    Animated.timing(sloganOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Animate truck and button together
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleGetStarted = () => {
    router.replace("/loginorsignup"); // Navigate to LoginSignup screen
  };


  return (
    <View style={styles.container}>
      {/* Slogan Animation */}
      <Animated.Text style={[styles.slogan, { opacity: sloganOpacity }]}>
        Live wise, <Text style={{ fontWeight: "bold", color: "#2E7D32" }}>WasteWise</Text>
      </Animated.Text>

      {/* Truck Image & Button Animation */}
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <Image
          source={require("../assets/images/Truck.png")}
          style={styles.truck}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
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
  slogan: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  content: {
    alignItems: "center",
  },
  truck: {
    width: 250, 
    height: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
