import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use a test or hardcoded email temporarily (replace later with AsyncStorage or SecureStore)
        const email = 'testuser@example.com';
        const response = await fetch(
          `https://wastewise-app.onrender.com/get-profile/read?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (data.user) {
          setProfile(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          // Simulate logout (real clearing of data not included)
          router.replace('/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/homepage')}>
          <Image source={require('../assets/images/Back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.heading}>My Profile</Text>

        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/MK3eW3As.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{profile?.full_name || 'Full Name'}</Text>
            <Text style={styles.email}>{profile?.email || 'Email not found'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profileedit')}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Info</Text>
          <Text style={styles.cardText}>📞 {profile?.phone_number || 'Phone number not provided'}</Text>
          <Text style={styles.cardText}>📍 {profile?.address || 'Address not provided'}</Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/homepage')}>
          <Image source={require('../assets/images/Home.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/info')}>
          <Image source={require('../assets/images/Info.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/payment')}>
          <Image source={require('../assets/images/Coin.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/profile')}>
          <Image source={require('../assets/images/User.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { width: 30, height: 30, marginBottom: 40 },
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  heading: { textAlign: 'center', fontSize: 24, color: 'green', fontWeight: 'bold', marginBottom: 30 },
  profileContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginRight: 16 },
  infoContainer: { justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  email: { fontSize: 14, color: 'gray' },
  editButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 25,
  },
  editButtonText: { color: '#fff', fontWeight: '500', fontSize: 16 },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
  },
  cardTitle: { fontWeight: 'bold', marginBottom: 12, fontSize: 18, color: '#333' },
  cardText: { fontSize: 16, color: '#555', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#e0e0e0', width: '100%', marginVertical: 25 },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoutButtonText: { color: '#fff', fontWeight: '500', fontSize: 16 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#D9EFD9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: { padding: 10 },
  navIcon: { width: 30, height: 30, tintColor: 'green' },
});

export default ProfileScreen;
