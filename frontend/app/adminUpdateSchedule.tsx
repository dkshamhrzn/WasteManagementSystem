import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function UpdateScheduleScreen() {
  const navigation = useNavigation();

  const [id, setId] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const clearFields = () => {
    setId('');
    setWasteType('');
    setDay('');
    setTime('');
  };
// Function to handle the update schedule
  const handleUpdate = async () => {
    if (!id || !wasteType || !day || !time) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    // Parse and validate time input
    const parsedTime = dayjs(time, ['h:mm A', 'HH:mm'], true);
    if (!parsedTime.isValid()) {
      Alert.alert('Invalid Time', 'Please enter time in 12-hour format like "10:30 AM".');
      return;
    }

    const time24 = parsedTime.format('HH:mm');

    try {
      setIsUpdating(true);
      Keyboard.dismiss();

      const response = await fetch(`https://wastewise-app.onrender.com/truck-schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wasteType, day, time: time24 }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update schedule');
      }

      const updatedData = await response.json();
      console.log('Successfully Updated:', updatedData);

      Alert.alert('✅ Success', 'Schedule updated!');
      clearFields();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('❌ Update Failed', (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/images/Back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Update Schedule</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Schedule ID:</Text>
          <TextInput
            style={styles.input}
            value={id}
            onChangeText={setId}
            placeholder="e.g. 6800afe2da0e876243c70e92"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Waste Type:</Text>
          <TextInput
            style={styles.input}
            value={wasteType}
            onChangeText={setWasteType}
          />

          <Text style={styles.label}>Day:</Text>
          <TextInput
            style={styles.input}
            value={day}
            onChangeText={setDay}
            placeholder="e.g. Monday"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Time (12-hour format e.g. 10:30 AM):</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="e.g. 10:30 AM"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity
            style={[styles.button, isUpdating && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={isUpdating}
            activeOpacity={0.8}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  scroll: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e3f2e1',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    width: '100%',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
