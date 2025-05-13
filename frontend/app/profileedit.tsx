import React, { useEffect, useState, useRef } from 'react';
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
  Modal,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export default function ProfileEdit() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(15);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showPrompt, setShowPrompt] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail =
          (await SecureStore.getItemAsync('userEmail')) ||
          (await AsyncStorage.getItem('userEmail'));

        if (!storedEmail) return router.replace('/login');
        setEmail(storedEmail);

        const response = await fetch(
          `https://wastewise-app.onrender.com/get-profile/read?email=${encodeURIComponent(
            storedEmail
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

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDeleting(false);
          setDeleteCountdown(15);
        }
      };
    }, [])
  );


  const handleSubmit = async () => {
  if (!fullName || !phoneNumber || !location) {
    return Alert.alert('Error', 'All fields are required.');
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


  const handleDeleteAccount = () => {
    setShowPrompt(true); // Show custom modal
  };

  const confirmDelete = (input?: string) => {
    if (input?.toLowerCase() === 'yes') {
      setDeleting(true);
      setDeleteCountdown(15);

      let secondsLeft = 15;
      intervalRef.current = setInterval(() => {
        secondsLeft -= 1;
        setDeleteCountdown(secondsLeft);

        if (secondsLeft <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          deleteAccount();
        }
      }, 1000);
    } else {
      Alert.alert('Cancelled', 'You must type "yes" to delete the account.');
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(
        `https://wastewise-app.onrender.com/delete-profile/delete?email=${encodeURIComponent(
          email
        )}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        Alert.alert('Deleted', 'Account successfully deleted.');
        await AsyncStorage.clear();
        await SecureStore.deleteItemAsync('userEmail');
        router.replace('/login');
      } else {
        throw new Error('Failed to delete account.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Deletion failed.');
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

        {deleting ? (
          <>
            <Text style={{ color: 'gray', marginTop: 10 }}>
              Account will be deleted in {deleteCountdown}s...
            </Text>
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: '#555' }]}
              onPress={() => {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                setDeleting(false);
                setDeleteCountdown(15);
              }}
            >
              <Text style={styles.deleteButtonText}>Cancel Deletion</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        )}

        {/* Modal Prompt */}
        {showPrompt && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Deletion</Text>
              <Text style={styles.modalText}>Type "yes" to confirm deletion.</Text>
              <TextInput
                style={styles.modalInput}
                value={confirmationText}
                onChangeText={setConfirmationText}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                  onPress={() => {
                    setShowPrompt(false);
                    setConfirmationText('');
                  }}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#ff4444' }]}
                  onPress={() => {
                    setShowPrompt(false);
                    confirmDelete(confirmationText);
                    setConfirmationText('');
                  }}
                >
                  <Text style={{ color: 'white' }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
