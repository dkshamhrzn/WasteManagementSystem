import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const AdminSendPickupNotice = () => {
  const { id } = useLocalSearchParams(); // Get user request ID from URL
  const requestId = Array.isArray(id) ? id[0] : id;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSend = async () => {
    if (!date || !time) {
      Alert.alert('Validation Error', 'Please enter both date and time.');
      return;
    }

    try {
      const response = await fetch(
        `https://wastewise-app.onrender.com/request-pickup/admin/requests/${requestId}/decision`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Approved',
            admin_confirmed_date: date,
            admin_confirmed_time: time,
          }),
        }
      );

      if (response.ok) {
        setMessage('Pickup notice sent successfully!');
        setMessageType('success');
        setDate('');
        setTime('');
      } else {
        throw new Error('Failed to send the notice');
      }
    } catch (error) {
      console.error('Error sending notice:', error);
      setMessage('Failed to send the notice. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="green" />
        <Text style={styles.headerText}>Send Pickup Notice</Text>
      </View>

      <Text style={styles.idText}>Request ID: {requestId}</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Date:</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Time:</Text>
          <TextInput
            placeholder="HH:MM AM/PM"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={time}
            onChangeText={setTime}
          />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>

        {message ? (
          <Text
            style={[
              styles.feedbackText,
              messageType === 'success' ? styles.success : styles.error,
            ]}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  headerText: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#225D30',
  },
  idText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: '#E7F3E3',
    borderRadius: 16,
    margin: 20,
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    width: 60,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
  },
  sendButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  feedbackText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});

export default AdminSendPickupNotice;
