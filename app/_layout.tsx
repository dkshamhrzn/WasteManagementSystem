import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Index Screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Get Started Screen */}
      <Stack.Screen name="getStarted" options={{ headerShown: false }} />

      {/* Login or Signup Screen */}
      <Stack.Screen name="loginorsignup" options={{ headerShown: false }} />

      {/* Login Screen */}
      <Stack.Screen name="login" options={{ headerShown: false }} />

      {/* Sign Up Screen */}
      <Stack.Screen name="signUpScreen" options={{ headerShown: false }} />

      {/* Forgot Password Screen */}
      <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />

      {/* Reset Password Screen */}
      <Stack.Screen name="resetPassword" options={{ headerShown: false }} />

      {/* Forgot Password Confirmation Screen */}
      <Stack.Screen name="forgotPasswordConfirmation" options={{ headerShown: false }} />

      {/* Homepage Screen */}
      <Stack.Screen name="homepage" options={{ headerShown: false }} />

      {/* 404 Not Found Screen */}
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}