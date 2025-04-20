import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* ===== PUBLIC ROUTES ===== */}
      {/* Welcome and authentication flows */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Onboarding journey */}
      <Stack.Screen name="getStarted" options={{ headerShown: false }} />
      <Stack.Screen name="loginorsignup" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
      
      {/* Password recovery path */}
      <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
      <Stack.Screen name="resetpassword" options={{ headerShown: false }} />
      <Stack.Screen name="forgotpasswordconfirmation" options={{ headerShown: false }} />

      {/* ===== PROTECTED ROUTES ===== */}
      {/* Core app functionality */}
      <Stack.Screen name="homepage" options={{ headerShown: false }} />
      <Stack.Screen name="WeeklyScheduleScreen" options={{ headerShown: false }} />
      
      {/* User profile and information */}
      <Stack.Screen name="info" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      
      {/* Payment gateway */}
      <Stack.Screen name="payment" options={{ headerShown: false }} />

      {/* ===== FUTURE ENHANCEMENTS ===== */}
      {/* 
        <Stack.Screen name="rewards" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      */}
    </Stack>
  );
}