import React from "react";
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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const RequestPickupScreen = () => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton}>
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
            open={false}
            value={null}
            items={[]}
            setOpen={() => {}}
            setValue={() => {}}
            setItems={() => {}}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
          />

          <Text style={styles.label}>Quantity (in kg or bags):</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5 kg or 3 bags"
          />

          <Text style={styles.label}>Pickup Location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Preferred Pickup Date (YYYY-MM-DD):</Text>
          <TextInput
            style={styles.input}
            placeholder="2025-05-05"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Preferred Pickup Time (e.g., 10:00 AM):</Text>
          <TextInput
            style={styles.input}
            placeholder="10:00 AM"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Additional notes (optional):</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Write any additional instructions"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Request Pickup</Text>
          </TouchableOpacity>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Estimated Price: Rs. 250</Text>
          </View>
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
  priceContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "green",
    borderWidth: 1,
  },
  priceText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
