// import React, { useEffect, useRef, useState } from "react";
// import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import * as Notifications from "expo-notifications";
// import registerForPushNotificationsAsync from "./utils/notification";
// import { StatusBar } from "expo-status-bar";
// import { Ionicons } from "@expo/vector-icons";

// // Enable alert, sound, and badge
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export default function NotificationScreen() {
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
//   const notificationListener = useRef<Notifications.Subscription | null>(null);
//   const responseListener = useRef<Notifications.Subscription | null>(null);

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) => {
//       if (token) setExpoPushToken(token);
//     });

//     notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
//       Alert.alert("📥 Notification", notification.request.content.title ?? "No Title");
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log("📬 Notification tapped:", response);
//     });

//     return () => {
//       if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
//       if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   const sendTestNotification = async () => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "🔔 Test Notification",
//         body: "This is a test notification with sound!",
//         sound: "default",
//       },
//       trigger: null, // Send immediately
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>🔔 Notification Test</Text>
//       <Text style={styles.tokenLabel}>Your Push Token:</Text>
//       <Text selectable style={styles.tokenText}>{expoPushToken ?? "Fetching..."}</Text>

//       <TouchableOpacity style={styles.button} onPress={sendTestNotification}>
//         <Ionicons name="notifications" size={20} color="white" />
//         <Text style={styles.buttonText}>Send Test Notification</Text>
//       </TouchableOpacity>

//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FFF9",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2E7D32",
//     marginBottom: 16,
//   },
//   tokenLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#2E7D32",
//     marginBottom: 4,
//   },
//   tokenText: {
//     fontSize: 14,
//     color: "#1B5E20",
//     marginBottom: 24,
//     textAlign: "center",
//   },
//   button: {
//     flexDirection: "row",
//     backgroundColor: "#4CAF50",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     marginLeft: 8,
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });
