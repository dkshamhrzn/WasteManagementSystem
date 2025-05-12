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

const RequestPickupScreen = () => {
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([
    { label: "Biodegradable", value: "Biodegradable" },
    { label: "Non-Biodegradable", value: "Non-Biodegradable" },
    { label: "Recyclable", value: "Recyclable" },
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
        const sortedData = data.sort((a, b) => {
          // If time information is available, combine date and time
          const dateA = new Date(`${a.final_date} ${a.final_time}`);
          const dateB = new Date(`${b.final_date} ${b.final_time}`);
          return dateB.getTime() - dateA.getTime();
        });
        setStatusData(sortedData);
      }
    } catch (error) {
      console.error("Status fetch failed:", error);
      Alert.alert("Error", "Failed to load pickup status.");
    } finally {
      setIsFetchingStatus(false);
    }
  };

  // Validate input fields and return true if valid, false otherwise.
  // Also, updates error state for fields with issues.
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!wasteType) newErrors.wasteType = "Please select a waste type.";
    if (!quantity || isNaN(Number(quantity))) newErrors.quantity = "Enter a valid quantity (e.g., 5.3).";
    if (!location) newErrors.location = "Pickup location is required.";
    
    if (!year || year.length !== 4 || isNaN(Number(year)))
      newErrors.year = "Enter a valid 4-digit year.";
    if (!month || isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12)
      newErrors.month = "Month must be between 1 and 12.";
    if (!day || isNaN(Number(day)) || Number(day) < 1 || Number(day) > 31)
      newErrors.day = "Day must be between 1 and 31.";
    if (!hour || isNaN(Number(hour)) || Number(hour) < 1 || Number(hour) > 12)
      newErrors.hour = "Hour must be between 1 and 12.";
    if (!minute || isNaN(Number(minute)) || Number(minute) < 0 || Number(minute) > 59)
      newErrors.minute = "Minute must be between 0 and 59.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPickupRequest = async () => {
  if (!validateForm()) {
    Alert.alert("Invalid Input", "Please correct the highlighted fields.");
    return;
  }

  // Ask user if they want to proceed to payment
  Alert.alert(
    "Paid Service",
    "This is a paid service. Do you want to proceed to payment?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          const preferredDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          const preferredTime = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")} ${ampm}`;

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

            resetForm();
            fetchPickupStatus(email);
            // Navigate to payment link
            router.replace("https://wastewise-app.onrender.com/generalpayment");
          } catch (error) {
            console.error("Submit failed:", error);
            Alert.alert("Error", "Failed to submit pickup request.");
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ],
    { cancelable: true }
  );
};


  const resetForm = () => {
    setWasteType("");
    setQuantity("");
    setLocation("");
    setYear("");
    setMonth("");
    setDay("");
    setHour("");
    setMinute("");
    setAmpm("AM");
    setNotes("");
    setErrors({});
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
          Use this form to request a waste pickup. Select the type of waste, fill in the details and our system will process your request.
        </Text>

        <View style={styles.card}>
          {/* Waste Type Picker */}
          <DropDownPicker
            placeholder="Type of waste"
            open={dropdownOpen}
            value={wasteType}
            items={dropdownItems}
            setOpen={setDropdownOpen}
            setValue={(callback: any) => {
              const newValue = callback(wasteType);
              setWasteType(newValue);
              if (newValue) setErrors((prev) => ({ ...prev, wasteType: "" }));
            }}
            setItems={setDropdownItems}
            style={[styles.dropdown, errors.wasteType && styles.inputError]}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
          />
          {errors.wasteType && <Text style={styles.errorText}>{errors.wasteType}</Text>}

          {/* Quantity */}
          <Text style={styles.label}>Quantity (kg):</Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            placeholder="e.g., 5.33"
            value={quantity}
            onChangeText={(text) => {
              setQuantity(text);
              setErrors((prev) => ({ ...prev, quantity: "" }));
            }}
            keyboardType="numeric"
          />
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}

          {/* Location */}
          <Text style={styles.label}>Pickup Location:</Text>
          <TextInput
            style={[styles.input, errors.location && styles.inputError]}
            placeholder="Enter location"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              setErrors((prev) => ({ ...prev, location: "" }));
            }}
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

          {/* Preferred Pickup Date */}
          <Text style={styles.label}>Preferred Pickup Date:</Text>
          <View style={styles.dateRow}>
            <TextInput
              style={[styles.dateInput, errors.year && styles.inputError]}
              placeholder="YYYY"
              maxLength={4}
              keyboardType="numeric"
              value={year}
              onChangeText={(text) => {
                setYear(text);
                setErrors((prev) => ({ ...prev, year: "" }));
              }}
            />
            <TextInput
              style={[styles.dateInput, errors.month && styles.inputError]}
              placeholder="MM"
              maxLength={2}
              keyboardType="numeric"
              value={month}
              onChangeText={(text) => {
                setMonth(text);
                setErrors((prev) => ({ ...prev, month: "" }));
              }}
            />
            <TextInput
              style={[styles.dateInput, errors.day && styles.inputError]}
              placeholder="DD"
              maxLength={2}
              keyboardType="numeric"
              value={day}
              onChangeText={(text) => {
                setDay(text);
                setErrors((prev) => ({ ...prev, day: "" }));
              }}
            />
          </View>
          {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
          {errors.month && <Text style={styles.errorText}>{errors.month}</Text>}
          {errors.day && <Text style={styles.errorText}>{errors.day}</Text>}

          {/* Preferred Pickup Time */}
          <Text style={styles.label}>Preferred Pickup Time:</Text>
          <View style={styles.dateRow}>
            <TextInput
              style={[styles.dateInput, errors.hour && styles.inputError]}
              placeholder="HH"
              maxLength={2}
              keyboardType="numeric"
              value={hour}
              onChangeText={(text) => {
                setHour(text);
                setErrors((prev) => ({ ...prev, hour: "" }));
              }}
            />
            <TextInput
              style={[styles.dateInput, errors.minute && styles.inputError]}
              placeholder="MM"
              maxLength={2}
              keyboardType="numeric"
              value={minute}
              onChangeText={(text) => {
                setMinute(text);
                setErrors((prev) => ({ ...prev, minute: "" }));
              }}
            />
            <TouchableOpacity
              style={styles.ampmButton}
              onPress={() => setAmpm(ampm === "AM" ? "PM" : "AM")}
            >
              <Text style={styles.ampmText}>{ampm}</Text>
            </TouchableOpacity>
          </View>
          {errors.hour && <Text style={styles.errorText}>{errors.hour}</Text>}
          {errors.minute && <Text style={styles.errorText}>{errors.minute}</Text>}

          {/* Additional Notes */}
          <Text style={styles.label}>Additional notes (optional):</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Write any additional instructions"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={submitPickupRequest} disabled={isSubmitting}>
            <Text style={styles.submitText}>{isSubmitting ? "Submitting..." : "Request Pickup"}</Text>
          </TouchableOpacity>

          {/* Status Loader and List */}
          {isFetchingStatus && <ActivityIndicator size="large" color="green" style={{ marginTop: 10 }} />}
          {statusData.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.statusTitle}>All Pickup Requests</Text>
              {statusData.map((item, index) => (
                <View key={index} style={styles.statusCard}>
                  <Text>
                    <Text style={styles.bold}>Waste Type:</Text> {item.waste_type}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Quantity:</Text> {item.quantity}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Location:</Text> {item.location}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Pickup Date:</Text> {item.final_date}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Pickup Time:</Text> {item.final_time}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Status:</Text> {item.status}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>Message:</Text> {item.user_status_message}
                  </Text>
                  <Text style={styles.statusPrice}>Estimated Price: Rs. {item.estimated_price}</Text>
                </View>
              ))}
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
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    flex: 1,
    marginHorizontal: 4,
    paddingHorizontal: 10,
  },
  ampmButton: {
    backgroundColor: "#fff",
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ampmText: {
    color: "green",
    fontWeight: "bold",
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
    marginTop: 10,
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});
