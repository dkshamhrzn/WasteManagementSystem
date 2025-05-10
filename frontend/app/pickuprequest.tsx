import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const RequestPickupScreen = () => {
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);

  interface StatusData {
    waste_type: string;
    quantity: string;
    location: string;
    final_date: string;
    final_time: string;
    status: string;
    user_status_message: string;
    estimated_price: number;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([
    { label: "Biodegradable", value: "Biodegradable" },
    { label: "Non-Biodegradable", value: "Non-Biodegradable" },
    { label: "Electronic Waste", value: "Electronic Waste" },
  ]);

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const secureEmail = await SecureStore.getItemAsync("userEmail");
      const asyncEmail = await AsyncStorage.getItem("userEmail");
      const userEmail = secureEmail || asyncEmail;

      if (userEmail) {
        setEmail(userEmail);
        fetchPickupStatus(userEmail);
      } else {
        Alert.alert("User email not found", "Please log in again.");
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
      Alert.alert("Error", "Failed to retrieve user email.");
    }
  };

  const fetchPickupStatus = async (userEmail: string) => {
    setIsFetchingStatus(true);
    try {
      const response = await fetch(
        `https://wastewise-app.onrender.com/request-pickup/user/requests/${userEmail}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setStatusData(data[data.length - 1]);
      }
    } catch (error) {
      console.error("Status fetch failed:", error);
      Alert.alert("Error", "Failed to load pickup status.");
    } finally {
      setIsFetchingStatus(false);
    }
  };

  const submitPickupRequest = async () => {
    if (!wasteType || !quantity || !location || !preferredDate || !preferredTime) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }

    const payload = {
      waste_type: wasteType,
      quantity,
      location,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes,
      user_email: email,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("https://wastewise-app.onrender.com/request-pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit pickup request");
      }

      Alert.alert("Success", "Pickup request submitted successfully.");
      fetchPickupStatus(email);
      resetForm();
    } catch (error) {
      console.error("Submit failed:", error);
      Alert.alert("Error", "Failed to submit pickup request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setWasteType("");
    setQuantity("");
    setLocation("");
    setPreferredDate("");
    setPreferredTime("");
    setNotes("");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("./homepage")}>
            <Image source={require("../assets/images/Back.png")} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Request for pickup</Text>
        </View>

        <Text style={styles.description}>
          Use this form to request a waste pickup. Select the type of waste, submit your request, and our system will process it for collection.
        </Text>

        <View style={styles.card}>
          <DropDownPicker
            placeholder="Type of waste"
            open={dropdownOpen}
            value={wasteType}
            items={dropdownItems}
            setOpen={setDropdownOpen}
            setValue={setWasteType}
            setItems={setDropdownItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
          />

          <Text style={styles.label}>Quantity (in kg or bags):</Text>
          <TextInput style={styles.input} placeholder="e.g., 5 kg or 3 bags" value={quantity} onChangeText={setQuantity} />

          <Text style={styles.label}>Pickup Location:</Text>
          <TextInput style={styles.input} placeholder="Enter location" value={location} onChangeText={setLocation} />

          <Text style={styles.label}>Preferred Pickup Date:</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={preferredDate} onChangeText={setPreferredDate} />

          <Text style={styles.label}>Preferred Pickup Time:</Text>
          <TextInput style={styles.input} placeholder="e.g., 10:00 AM" value={preferredTime} onChangeText={setPreferredTime} />

          <Text style={styles.label}>Additional notes (optional):</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Write any additional instructions"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity style={styles.submitButton} onPress={submitPickupRequest} disabled={isSubmitting}>
            <Text style={styles.submitText}>
              {isSubmitting ? "Submitting..." : "Request Pickup"}
            </Text>
          </TouchableOpacity>

          {isFetchingStatus && <ActivityIndicator size="large" color="green" style={{ marginTop: 10 }} />}

          {statusData && (
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Latest Pickup Status</Text>
              <Text><Text style={styles.bold}>Waste Type:</Text> {statusData.waste_type}</Text>
              <Text><Text style={styles.bold}>Quantity:</Text> {statusData.quantity}</Text>
              <Text><Text style={styles.bold}>Location:</Text> {statusData.location}</Text>
              <Text><Text style={styles.bold}>Pickup Date:</Text> {statusData.final_date}</Text>
              <Text><Text style={styles.bold}>Pickup Time:</Text> {statusData.final_time}</Text>
              <Text><Text style={styles.bold}>Status:</Text> {statusData.status}</Text>
              <Text><Text style={styles.bold}>Message:</Text> {statusData.user_status_message}</Text>
              <Text style={styles.statusPrice}>Estimated Price: Rs. {statusData.estimated_price}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RequestPickupScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginLeft: 58,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#E4F1DE",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    marginBottom: 12,
    height: 48,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  dropdownText: {
    fontSize: 14,
    color: "green",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "green",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "green",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusCard: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "green",
    borderWidth: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  statusPrice: {
    marginTop: 8,
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
});
