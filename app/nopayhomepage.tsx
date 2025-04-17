import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card as PaperCard } from "react-native-paper";
import { router } from "expo-router";

const nopayhomepage = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>WasteWise</Text>
        <Text style={styles.subHeader}>Schedule 1</Text>
        <Image source={require("../assets/images/Truck.png")} style={styles.truckImage} />

        <PaperCard style={styles.card}>
          <PaperCard.Content>
            <Text style={styles.infoText}>Tap the button below to access your schedule information</Text>
            <TouchableOpacity style={styles.paymentButton} onPress={() => router.push("/payment")}>  
              <Text style={styles.buttonText}>Make Payment</Text>
            </TouchableOpacity>
          </PaperCard.Content>
        </PaperCard>

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
    backgroundColor: "#D9EFD9",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  paymentButton: {
    display: "flex",
    width: 158,
    padding:10,
    justifyContent: "center",
    alignItems: "center",
    gap:10,
    backgroundColor: "green",
    borderRadius:20,
    marginLeft:74,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
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

export default nopayhomepage;
