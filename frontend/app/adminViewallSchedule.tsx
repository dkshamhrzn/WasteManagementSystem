import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
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

const adminViewallSchedule = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("https://wastewise-app.onrender.com/truck-schedules/all-schedules");
        const data: WasteSchedule[] = await response.json();

        const processedSchedules = data.map(item => ({
          ID: item._id,
          Day: `${item.day}, ${new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
          WasteType: item.wasteType,
          Time: item.time,
          Status: item.status,
          IsRed: item.status === "Scheduled" && new Date(item.date).toDateString() === new Date().toDateString(),
        }));

        setSchedules(processedSchedules);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
    if (Platform.OS === "android") {
      ToastAndroid.show("ID copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied", "ID copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={require("../assets/images/Back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {schedules.map((item, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity onPress={() => copyToClipboard(item.ID)}>
              <View style={styles.row}>
                <Text style={[styles.text, styles.idText]}>
                  🔗 ID: {item.ID} (Tap to copy)
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.row}>
              <Image
                source={require("../assets/images/Calendar.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>{item.Day}</Text>
            </View>

            <View style={styles.row}>
              <Image
                source={require("../assets/images/Bin.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>Waste Type: {item.WasteType}</Text>
            </View>

            <View style={styles.row}>
              <Image
                source={require("../assets/images/Clock.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>{item.Time}</Text>
            </View>

            <View style={styles.row}>
              <Image
                source={require("../assets/images/Check.png")}
                style={styles.icon}
              />
              <Text style={[
                styles.text,
                item.IsRed ? styles.statusUpcoming :
                item.Status === "Completed" ? styles.statusComplete :
                styles.statusNormal
              ]}>
                Status: {item.Status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  scrollContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 100,
  },
  card: {
    width: 362,
    backgroundColor: "#E4F1DE",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    width: 33,
    height: 33,
    marginRight: 10,
    resizeMode: "contain",
  },
  text: {
    fontSize: 14,
    color: "green",
    fontWeight: "500",
    flexShrink: 1,
  },
  idText: {
    fontSize: 12,
    color: "#444",
    fontStyle: "italic",
  },
  statusUpcoming: {
    color: "red",
    fontWeight: "bold",
  },
  statusComplete: {
    color: "gray",
    fontWeight: "bold",
  },
  statusNormal: {
    color: "green",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default adminViewallSchedule;
