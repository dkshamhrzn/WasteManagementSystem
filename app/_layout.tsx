import { Stack } from "expo-router";
// import { NotificationProvider } from "./utils/notificationcontext"; // ✅ Correct usage

export default function RootLayout() {
  return (
    // <NotificationProvider>
      <Stack>
        {/* ===== PUBLIC ROUTES ===== */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="getStarted" options={{ headerShown: false }} />
        <Stack.Screen name="loginorsignup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="resetpassword" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpasswordconfirmation" options={{ headerShown: false }} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Stack.Screen name="homepage" options={{ headerShown: false }} />
        <Stack.Screen name="WeeklyScheduleScreen" options={{ headerShown: false }} />
        <Stack.Screen name="info" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="profileedit" options={{ headerShown: false }} />
        {/* <Stack.Screen name="notification" options={{ headerShown: false }} /> */}
        <Stack.Screen name="payment" options={{ headerShown: false }} />
        <Stack.Screen name="nopayhomepage" options={{ headerShown: false }} />

        {/* ===== ADMIN FUNCTIONALITY ===== */}
        <Stack.Screen name="adminCreateNewSchedule" options={{ headerShown: false }} />
        <Stack.Screen name="adminDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="adminDeleteSchedule" options={{ headerShown: false }} />
        <Stack.Screen name="adminManageSchedule" options={{ headerShown: false }} />
        <Stack.Screen name="adminUpdateSchedule" options={{ headerShown: false }} />
        <Stack.Screen name="adminViewSchedule" options={{ headerShown: false }} />
        <Stack.Screen name="adminViewallSchedule" options={{ headerShown: false }} />
        <Stack.Screen name="pickuprequest" options={{ headerShown: false }} />
        <Stack.Screen name="adminSendPickupNotice" options={{ headerShown: false }} />
        <Stack.Screen name="adminViewRequest" options={{ headerShown: false }} />   
        <Stack.Screen name="adminViewAllUser" options={{ headerShown: false }} />
        <Stack.Screen name="adminProfile" options={{ headerShown: false }} />   
      </Stack>
    // {/* </NotificationProvider> */}
  );
}
