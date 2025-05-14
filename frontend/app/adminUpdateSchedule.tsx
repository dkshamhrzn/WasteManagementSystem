import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function UpdateScheduleScreen() {
  const [id, setId] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');

  const handleUpdate = () => {
    if (!id || !day || !time) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    // Replace with actual API update logic
    console.log('Updated Schedule:', { id, day, time });
    Alert.alert('Success', 'Schedule updated!');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.heading}>Update Schedule</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID:</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={setId}
          placeholder="Enter ID"
          placeholderTextColor="#aaa"
        />

        <View style={styles.separator} />

        <Text style={styles.label}>Day</Text>
        <TextInput
          style={styles.input}
          value={day}
          onChangeText={setDay}
        />

        <View style={styles.separator} />

        <Text style={styles.label}>Time:</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 60,
  },
  heading: {
    fontSize: 18,
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
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
