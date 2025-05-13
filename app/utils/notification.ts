// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";
// import { Alert } from "react-native";

// export default async function registerForPushNotificationsAsync(): Promise<string | null> {
//   if (!Device.isDevice) {
//     Alert.alert("Must use physical device for Push Notifications");
//     return null;
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") {
//     Alert.alert("Failed to get push token for push notification!");
//     return null;
//   }

//   const tokenData = await Notifications.getExpoPushTokenAsync();
//   const token = tokenData.data;
//   console.log("✅ Expo Push Token:", token);

//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       sound: "default", // Enable sound on Android
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// }
