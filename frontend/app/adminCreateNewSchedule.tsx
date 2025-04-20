import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';

export default function CreateScheduleScreen() {
  const [wasteType, setWasteType] = useState('Biodegradable');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  const handleSave = async () => {
    if (!day || !time) {
      setPopupMessage('❌ Please enter both day and time.');
      setTimeout(() => setPopupMessage(''), 3000);
      return;
    }

    try {
      const response = await fetch('https://wastewise-app.onrender.com/truck-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wasteType, day, time }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Saved Schedule:', data);
        setPopupMessage('✅ New schedule created!');
        setDay('');
        setTime('');
      } else {
        const errorData = await response.json();
        console.error('Error saving schedule:', errorData);
        setPopupMessage('❌ Failed to create schedule.');
      }

      setTimeout(() => setPopupMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('❌ Something went wrong.');
      setTimeout(() => setPopupMessage(''), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Create New Schedule</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Waste Type:</Text>
        <View style={styles.pickerContainer}>
          <RNPicker
            selectedValue={wasteType}
            onValueChange={(value) => setWasteType(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <RNPicker.Item label="Biodegradable" value="Biodegradable" />
            <RNPicker.Item label="Non-Biodegradable" value="Non-Biodegradable" />
            <RNPicker.Item label="Recyclable" value="Recyclable" />
          </RNPicker>
        </View>

        <Text style={styles.label}>Day:</Text>
        <TextInput
          style={styles.input}
          value={day}
          onChangeText={setDay}
          placeholder="Enter day"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Time:</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="Enter time"
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {popupMessage ? (
        <View style={styles.popup}>
          <Text style={styles.popupText}>{popupMessage}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e3f2e1',
    borderRadius: 10,
    padding: 20,
    width: '85%',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
    color: '#000',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    height: Platform.OS === 'android' ? 50 : undefined,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 5,
    marginTop: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  popup: {
    position: 'absolute',
    top: 20,
    backgroundColor: '#333',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 999,
  },
  popupText: {
    color: '#fff',
    fontSize: 14,
  },
});
