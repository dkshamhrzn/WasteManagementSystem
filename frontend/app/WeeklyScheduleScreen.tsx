import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

// Interface for the Waste Schedule
interface WasteSchedule {
  _id: string;
  wasteType: string;
  time: string;
  date: string;
  status: string;
  day: string;
  __v: number;
}

const WeeklyScheduleScreen = () => {
  // State to store the fetched schedules
  const [schedules, setSchedules] = useState<any[]>([]);
  
  // State to manage loading status
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch schedules from API on component mount
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // Fetch data from the API
        const response = await fetch("https://wastewise-app.onrender.com/truck-schedules/all-schedules");
        const data: WasteSchedule[] = await response.json();
        
        // Process and map the fetched data to required format
        const processedSchedules = data.map(item => ({
          Day: `${item.day}, ${new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
          WasteType: item.wasteType,
          Time: item.time,
          Status: item.status,
          DateObject: new Date(item.date), // Adding the Date object for sorting
          IsRed: item.status === "Today's Collection" && new Date(item.date).toDateString() === new Date().toDateString()
        }));
        
        // Sort schedules by date (ascending)
        processedSchedules.sort((a, b) => a.DateObject.getTime() - b.DateObject.getTime());
        
        // Set the processed schedules in the state
        setSchedules(processedSchedules);
        
        // Turn off loading once data is fetched
        setLoading(false);
      } catch (error) {
        // Handle errors and turn off loading
        console.error("Failed to fetch schedules:", error);
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchSchedules();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Button to navigate to the previous screen */}
        <TouchableOpacity onPress={() => router.replace('/homepage')} style={styles.backButton}>
          <Image
            source={require("../assets/images/Back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        {/* Title Text for the screen */}
        <Text style={styles.test}>Weekly Schedule WasteWise</Text>
      </View>

      {/* Scrollable view to display all schedules */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {schedules.map((item, index) => (
          // Card for each schedule
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              {/* Calendar icon and the date */}
              <Image
                source={require("../assets/images/Calendar2.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>{item.Day}</Text>
            </View>

            <View style={styles.row}>
              {/* Bin icon and the waste type */}
              <Image
                source={require("../assets/images/Bin.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>Waste Type: {item.WasteType}</Text>
            </View>

            <View style={styles.row}>
              {/* Clock icon and the time */}
              <Image
                source={require("../assets/images/Clock.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>{item.Time}</Text>
            </View>

            <View style={styles.row}>
              {/* Check icon and the status */}
              <Image
                source={require("../assets/images/Check.png")}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.text,
                  item.IsRed
                    ? styles.statusUpcoming // Red if today's collection
                    : item.Status === "Completed"
                    ? styles.statusComplete // Gray if completed
                    : styles.statusNormal, // Green for normal status
                ]}
              >
                Status: {item.Status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background for the screen
  },
  headerContainer: {
    flexDirection: "row", // Align header elements horizontally
    alignItems: "center", // Center vertically
    paddingTop: 50,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  backButton: {
    marginRight: 10, // Space between back button and title
  },
  test: {
    color: "green", // Title color
    fontSize: 20,
    fontWeight: "bold", // Bold font for the title
    justifyContent: "center",
    marginLeft: 58, // Space for better alignment
  },
  backIcon: {
    width: 38,
    height: 38,
    resizeMode: "contain", // Ensure back icon fits within container
  },
  scrollContainer: {
    alignItems: "center", // Center content horizontally
    paddingTop: 20,
    paddingBottom: 100, // Padding at the bottom for better spacing
  },
  card: {
    width: 362, // Card width
    height: 175, // Card height
    backgroundColor: "#E4F1DE", // Light green background for the card
    borderRadius: 12, // Rounded corners
    padding: 15, // Padding inside the card
    marginBottom: 15, // Space between cards
    justifyContent: "space-around", // Space between elements inside card
    shadowColor: "#000", // Shadow effect for card
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3, // Shadow elevation for Android
  },
  row: {
    flexDirection: "row", // Align icons and text horizontally
    alignItems: "center", // Center items vertically
    marginBottom: 3, // Space between rows
  },
  icon: {
    width: 33, // Icon size
    height: 33,
    marginRight: 10, // Space between icon and text
    resizeMode: "contain", // Ensure icons scale correctly
  },
  text: {
    fontSize: 14, // Text size
    color: "green", // Green text color
    fontWeight: "500", // Semi-bold text
  },
  statusUpcoming: {
    color: "red", // Red color for today's collection status
    fontWeight: "bold", // Bold text for emphasis
  },
  statusComplete: {
    color: "gray", // Gray color for completed status
    fontWeight: "bold", // Bold text for emphasis
  },
  statusNormal: {
    color: "green", // Green color for normal status
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center", // Center loading indicator
    alignItems: "center", // Center loading indicator
  },
});

export default WeeklyScheduleScreen;
