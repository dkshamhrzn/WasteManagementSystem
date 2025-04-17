import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";

interface WasteSchedule {
  _id: string;
  wasteType: string;
  time: string;
  date: string;
  day: string;
}

const WeeklyScheduleScreen = () => {
  const [schedules, setSchedules] = useState<WasteSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("https://wastewise-app.onrender.com/truck-schedules/all-schedules");
        const data = await response.json();
        setSchedules(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {schedules.map((item) => (
          <View key={item._id} style={styles.card}>
            <View style={styles.row}>
              <Image
                source={require("../assets/images/Calendar2.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>{item.day}, {new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.row}>
              <Image
                source={require("../assets/images/Bin.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>{item.wasteType}</Text>
            </View>
            <View style={styles.row}>
              <Image
                source={require("../assets/images/Clock.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#E4F1DE",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "green",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WeeklyScheduleScreen;