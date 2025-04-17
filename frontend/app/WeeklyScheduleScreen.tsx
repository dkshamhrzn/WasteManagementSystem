import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const WeeklyScheduleScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require("../assets/images/Back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.test}>Weekly Schedule WasteWise</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Placeholder for schedule data */}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/homepage")}>
          <Image source={require("../assets/images/Home.png")} style={styles.navIcon} />
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  test: {
    color: "green",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    marginLeft: 58,
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
});

export default WeeklyScheduleScreen;
