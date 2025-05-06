import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';

export default function ProfileEdit() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const email = 'sisirsisir98052@gmail.com';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://wastewise-app.onrender.com/get-profile/read?email=${encodeURIComponent(
            email
          )}`
        );
        const data = await response.json();
        const user = data.user;

        setFullName(user.full_name);
        setPhoneNumber(user.phone_number);
        setLocation(user.address);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    fetchUserData();
  }, []);

  const validateLocation = async (query: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();
      return data.length > 0;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !phoneNumber || !location) {
      return Alert.alert('Error', 'All fields are required.');
    }

    const isValidLocation = await validateLocation(location);
    if (!isValidLocation) {
      return Alert.alert('Invalid Location', 'Please enter a valid location.');
    }

    try {
      const response = await fetch(
        'https://wastewise-app.onrender.com/update-profile/update',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            full_name: fullName,
            phone_number: phoneNumber,
            address: location,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully.');
        router.back();
      } else {
        throw new Error(result.message || 'Failed to update');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Update failed.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/Back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: 'https://i.imgur.com/MK3eW3As.jpg' }}
              style={styles.profileImage}
            />
            <Image
              source={require('../assets/images/Edit.png')}
              style={styles.editIcon}
            />
          </View>

          <Text style={styles.title}>Edit profile</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  card: {
    width: 340,
    backgroundColor: '#E9F5E1',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 103,
    height: 106,
    borderRadius: 53,
  },
  editIcon: {
    position: 'absolute',
    right: -5,
    top: 70,
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginLeft: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#69A569',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: '#2F8F2F',
    width: 172,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
