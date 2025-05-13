import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const ProfileScreen = () => {
  const [profile, setProfile] = useState<{
    _id?: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const email =
          (await SecureStore.getItemAsync('userEmail')) ||
          (await AsyncStorage.getItem('userEmail'));

        const paid = await SecureStore.getItemAsync('isPaid');
        setIsPaid(paid === 'true');

        if (email) {
          setUserEmail(email);
          await fetchProfile(email);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const fetchProfile = async (email: string) => {
    try {
      const response = await fetch(
        `https://wastewise-app.onrender.com/get-profile/read?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (data.user) {
        setProfile(data.user);

        const userId = data.user._id;
        if (userId) {
          await SecureStore.setItemAsync('userId', userId);
          await AsyncStorage.setItem('userId', userId);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await SecureStore.deleteItemAsync('userEmail');
          await SecureStore.deleteItemAsync('userId');
          await AsyncStorage.removeItem('userEmail');
          await AsyncStorage.removeItem('userId');
          router.replace('/login');
        },
      },
    ]);
  };

  const navigateHome = () => {
    if (isPaid) {
      router.push('/homepage');
    } else {
      router.push('/nopayhomepage');
    }
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
        <TouchableOpacity style={styles.backButton} onPress={navigateHome}>
          <Image source={require('../assets/images/Back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.heading}>My Profile</Text>

        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/MK3eW3As.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{profile?.full_name || 'Full name not available'}</Text>
            <Text style={styles.email}>{profile?.email || 'Email not available'}</Text>
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
        <TouchableOpacity style={styles.navButton} onPress={navigateHome}>
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
  backButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  backIcon: { width: 30, height: 30, resizeMode: 'contain' },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
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
    backgroundColor: '#E4F1DE',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 18,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: 25,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
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
  navIcon: {
    width: 30,
    height: 30,
    tintColor: 'green',
  },
});

export default ProfileScreen;
