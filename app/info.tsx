import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const Info = () => {
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const paid = await SecureStore.getItemAsync('isPaid');
      setIsPaid(paid === 'true');
    };
    fetchPaymentStatus();
  }, []);

  const navigateHome = () => {
    if (isPaid === true) {
      router.push('/homepage');
    } else {
      router.push('/nopayhomepage');
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Header with Logo */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateHome} style={styles.backButton}>
          <Image
            source={require('../assets/images/Back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.headerLogo}
          />
          <Text style={styles.headerText}>WasteWise</Text>
        </View>

        <View style={styles.emptySpace} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>About us</Text>
          <Text style={styles.text}>
            WasteWise is a smart waste management system that helps you keep track of waste collection 
            schedules, request pickups, and ensure responsible disposal.
          </Text>

          <Text style={styles.subtitle}>Features of WasteWise</Text>

          <Text style={styles.featureItem}>📅 Waste Collection Schedule & Notifications</Text>
          <Text style={styles.featureDetail}>Users receive automatic notifications on collection days.</Text>

          <Text style={styles.featureItem}>🚛 Request Pickup Service</Text>
          <Text style={styles.featureDetail}>Schedule a pickup for specific waste types (📄Paper, 🏗Metal, 🛍Plastic, etc.).</Text>
          <Text style={styles.featureDetail}>Secure payment to Khalti before confirming the request.</Text>

          <Text style={styles.featureItem}>🔔 Notifications & Reminders</Text>
          <Text style={styles.featureDetail}>Get notified on the day of collection and one day before the pickup date.</Text>

          <Text style={styles.subtitle}>💰 Payment & Pricing</Text>
          <Text style={styles.text}>
            • Payment for on-demand pickups is included through Khalti.
            {"\n"}• Charges may vary based on waste type and quantity.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>📖 How To Use the App?</Text>

          <Text style={styles.stepTitle}>1. Check Your Schedule</Text>
          <Text style={styles.stepDetail}>View your upcoming waste collection days.</Text>

          <Text style={styles.stepTitle}>2. Get Notifications</Text>
          <Text style={styles.stepDetail}>Get alerts for your scheduled collection.</Text>

          <Text style={styles.stepTitle}>3. Request a Pickup</Text>
          <Text style={styles.stepDetail}>Choose waste type & pay via Khalti.</Text>

          <Text style={styles.stepTitle}>4. Track Your Request</Text>
          <Text style={styles.stepDetail}>See the status of your pickup.</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={navigateHome}>
          <Image
            source={require('../assets/images/Home.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/info')}
        >
          <Image
            source={require('../assets/images/Info.png')}
            style={[styles.navIcon, styles.activeNavIcon]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/payment')}
        >
          <Image
            source={require('../assets/images/Coin.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push('/profile')}
        >
          <Image
            source={require('../assets/images/User.png')}
            style={styles.navIcon}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerLogo: {
    width: 60,
    height: 50,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },
  emptySpace: {
    width: 24,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 15,
  },
  featureDetail: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 24,
    marginBottom: 5,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 15,
  },
  stepDetail: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 24,
    marginBottom: 5,
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
  activeNavIcon: {
    tintColor: 'darkgreen',
  },
});

export default Info;
