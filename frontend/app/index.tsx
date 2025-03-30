import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet,} from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [showSlogan, setShowSlogan] = useState(false);

  useEffect(() => {
    // Show slogan after 2 seconds
    const sloganTimer = setTimeout(() => {
      setShowSlogan(true);
    }, 3000);

    // Navigate to 'get-started' after another 2 seconds (total 4 seconds)
    const navigateTimer = setTimeout(() => {
      router.replace("/getStarted");
    }, 4000);

    return () => {
      clearTimeout(sloganTimer);
      clearTimeout(navigateTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {!showSlogan ? (
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      ) : (
        <Text style={styles.slogan}>
          Live wise, <Text style={{ fontWeight: "bold", color: "#2E7D32" }}>WasteWise</Text>
        </Text>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  slogan: {
    fontSize: 18,
    color: "#333",
  },
});
