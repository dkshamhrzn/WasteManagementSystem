import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card as PaperCard } from "react-native-paper";
import { router } from "expo-router";

// Interface for WasteSchedule to define the structure of the schedule data
interface WasteSchedule {
  _id: string;
  wasteType: string;
  time: string; 
  date: string;
  status: string;
  day: string;
  __v: number;
}

const homepage = () => {
  // State to store the next collection schedule
  const [nextCollection, setNextCollection] = useState<WasteSchedule | null>(null);
  // State to store the number of days left for the next collection
  const [daysLeft, setDaysLeft] = useState<number>(0);
  // State to track the loading state while fetching data
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch function to get all truck schedules
    const fetchWasteSchedules = async () => {
      try {
        // Make API call to get the truck schedules
        const response = await fetch("https://wastewise-app.onrender.com/truck-schedules/all-schedules");
        const data: WasteSchedule[] = await response.json(); // Parse the response as WasteSchedule array
        console.log(data);

        // Get today's date without the time part
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find the next upcoming collection schedule
        const upcoming = data
          .filter(s => {
            const scheduleDate = new Date(s.date);
            scheduleDate.setHours(0, 0, 0, 0);
            return scheduleDate >= today; // Only consider future dates
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]; // Sort by date and pick the first

        if (upcoming) {
          setNextCollection(upcoming); // Set the next collection schedule
          const collectionDate = new Date(upcoming.date);
          collectionDate.setHours(0, 0, 0, 0);
          const diffTime = collectionDate.getTime() - today.getTime(); // Calculate the difference in time
          const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convert time difference to days
          setDaysLeft(diffDays); // Set the number of days left
        }

        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        setLoading(false); // Stop loading on error
      }
    };

    fetchWasteSchedules(); // Call the fetch function on component mount
  }, []);

  // Show a loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>WasteWise</Text>
        <Text style={styles.subHeader}>Schedule</Text>
        {/* Display truck image */}
        <Image source={require("../assets/images/Truck.png")} style={styles.truckImage} />

        {/* Display next collection details if available */}
        {nextCollection ? (
          <PaperCard style={styles.card}>
            <PaperCard.Content>
              <Text style={styles.title}>
                Upcoming collection: {" "}
                <Text style={styles.boldText}>
                  {nextCollection.day}, {new Date(nextCollection.date).toDateString().split(" ").slice(1).join(" ")} ({nextCollection.wasteType})
                </Text>
              </Text>
              <Text style={styles.subtitle}>
                Time: <Text style={styles.boldText}>{nextCollection.time}</Text>
              </Text>
              <Text style={styles.subtitle}>
                Status: <Text style={styles.boldText}>{nextCollection.status}</Text>
              </Text>

              {/* Show warning messages based on the number of days left */}
              {daysLeft === 0 ? (
                <Text style={styles.todayWarning}>⚠️ Today is the collection day!</Text>
              ) : daysLeft === 1 ? (
                <Text style={styles.warning}>⚠️ Collection is tomorrow!</Text>
              ) : (
                <Text style={styles.warning}>⚠️ Collection in {daysLeft} days</Text>
              )}
            </PaperCard.Content>
          </PaperCard>
        ) : (
          // Display message if no upcoming collection is found
          <PaperCard style={styles.card}>
            <PaperCard.Content>
              <Text style={styles.title}>No upcoming collections scheduled</Text>
            </PaperCard.Content>
          </PaperCard>
        )}

        {/* Button container for navigating to other screens */}
        <View style={styles.buttonContainer}>
          {/* View Schedule button */}
          <PaperCard style={styles.actionCard}>
            <PaperCard.Content style={styles.centerContent}>
              <Image source={require("../assets/images/Calendar.png")} style={styles.largeIcon} />
              <TouchableOpacity style={styles.button} onPress={() => router.push("/WeeklyScheduleScreen")}>
                <Text style={styles.buttonText}>View Schedule</Text>
              </TouchableOpacity>
            </PaperCard.Content>
          </PaperCard>

          {/* Request Pickup button */}
          <PaperCard style={styles.actionCard}>
            <PaperCard.Content style={styles.centerContent}>
              <Image source={require("../assets/images/Pickuprequest.png")} style={styles.largeIcon} />
              <TouchableOpacity style={styles.button} onPress={() => router.push("/payment")}>
                <Text style={styles.buttonText}>Request Pickup</Text>
              </TouchableOpacity>
            </PaperCard.Content>
          </PaperCard>
        </View>
      </ScrollView>

      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>
        {/* Home button */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push("/homepage")}
        >
          <Image source={require("../assets/images/Home.png")} style={styles.navIcon} />
        </TouchableOpacity>
        
        {/* Info button */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push("/info")}
        >
          <Image source={require("../assets/images/Info.png")} style={styles.navIcon} />
        </TouchableOpacity>
        
        {/* Payment button */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push("/payment")}
        >
          <Image source={require("../assets/images/Coin.png")} style={styles.navIcon} />
        </TouchableOpacity>
        
        {/* Profile button */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push("/profile")}
        >
          <Image source={require("../assets/images/User.png")} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginBottom: 5,
    marginTop: 15,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  truckImage: {
    width: 180,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  card: {
    width: 362,
    height: 175,
    backgroundColor: "#D9EFD9",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
    color: "green",
  },
  warning: {
    color: "orange",
    marginTop: 5,
  },
  todayWarning: {
    color: "red",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 15,
  },
  actionCard: {
    width: "45%",
    backgroundColor: "#F5FFF5",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  centerContent: {
    alignItems: "center",
  },
  largeIcon: {
    width: 90,
    height: 90,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default homepage;
