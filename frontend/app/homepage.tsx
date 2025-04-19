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
  const [nextCollection, setNextCollection] = useState<WasteSchedule | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWasteSchedules = async () => {
      try {
        const response = await fetch("https://wastewise-app.onrender.com/truck-schedules/all-schedules");
        const data: WasteSchedule[] = await response.json();

        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update status for today's collection if 4+ hours have passed
        const updatedData = data.map((schedule) => {
          const scheduleDate = new Date(schedule.date);
          const isToday = scheduleDate.toDateString() === now.toDateString();

          if (isToday) {
            const [hourStr, minuteStr] = schedule.time.split(":");
            const scheduledTime = new Date(schedule.date);
            scheduledTime.setHours(parseInt(hourStr) + 4, parseInt(minuteStr), 0, 0);
          }

          return schedule;
        });

        // Filter upcoming schedules (today or future)
        const upcoming = updatedData
          .filter((s) => {
            const scheduleDate = new Date(s.date);
            scheduleDate.setHours(0, 0, 0, 0);
            return scheduleDate >= today;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        if (upcoming) {
          setNextCollection(upcoming);
          const collectionDate = new Date(upcoming.date);
          collectionDate.setHours(0, 0, 0, 0);
          const diffTime = collectionDate.getTime() - today.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          setDaysLeft(diffDays);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        setLoading(false);
      }
    };

    fetchWasteSchedules();
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>WasteWise</Text>
        <Text style={styles.subHeader}>Schedule</Text>
        <Image source={require("../assets/images/Truck.png")} style={styles.truckImage} />

        {nextCollection ? (
          <PaperCard style={styles.card}>
            <PaperCard.Content>
              <Text style={styles.title}>
                Upcoming collection:{" "}
                <Text style={styles.boldText}>
                  {nextCollection.day}, {new Date(nextCollection.date).toDateString().split(" ").slice(1).join(" ")} ({nextCollection.wasteType})
                </Text>
              </Text>
              <Text style={styles.subtitle}>
                Time: <Text style={styles.boldText}>{nextCollection.time}</Text>
              </Text>
              <Text style={styles.subtitle}>
                Status:{" "}
                <Text
                  style={[
                    styles.boldText,
                    nextCollection.status === "Collection Complete" && { color: "red" }, // Style
                  ]}
                >
                  {nextCollection.status}
                </Text>
              </Text>

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
          <PaperCard style={styles.card}>
            <PaperCard.Content>
              <Text style={styles.title}>No upcoming collections scheduled</Text>
            </PaperCard.Content>
          </PaperCard>
        )}

        <View style={styles.buttonContainer}>
          <PaperCard style={styles.actionCard}>
            <PaperCard.Content style={styles.centerContent}>
              <Image source={require("../assets/images/Calendar.png")} style={styles.largeIcon} />
              <TouchableOpacity style={styles.button} onPress={() => router.push("/WeeklyScheduleScreen")}>
                <Text style={styles.buttonText}>View Schedule</Text>
              </TouchableOpacity>
            </PaperCard.Content>
          </PaperCard>

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

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/homepage")}>
          <Image source={require("../assets/images/Home.png")} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/info")}>
          <Image source={require("../assets/images/Info.png")} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/payment")}>
          <Image source={require("../assets/images/Coin.png")} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/profile")}>
          <Image source={require("../assets/images/User.png")} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
