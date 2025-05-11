import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type PickupRequest = {
  _id: string;
  waste_type: string;
  quantity: string;
  location: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  estimated_price: number;
  status: string;
  user_email: string;
  admin_confirmed_date: string | null;
  admin_confirmed_time: string | null;
  createdAt: string;
};

const AdminViewRequest = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://wastewise-app.onrender.com/request-pickup/admin/requests')
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load requests');
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#225D30" />;
  if (error) return <Text style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="green" />
        </TouchableOpacity>
        <Text style={styles.header}>Pickup Requests</Text>
      </View>

      {requests.map((request) => (
        <View key={request._id} style={styles.card}>
          <Text style={styles.label}>Waste Type:</Text>
          <Text style={styles.value}>{request.waste_type}</Text>

          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{request.quantity}</Text>

          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{request.location}</Text>

          <Text style={styles.label}>Preferred Date:</Text>
          <Text style={styles.value}>{request.preferred_date}</Text>

          <Text style={styles.label}>Preferred Time:</Text>
          <Text style={styles.value}>{request.preferred_time}</Text>

          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{request.status}</Text>

          <Text style={styles.label}>User Email:</Text>
          <Text style={styles.value}>{request.user_email}</Text>

          <Text style={styles.label}>Estimated Price:</Text>
          <Text style={styles.value}>Rs. {request.estimated_price}</Text>

          <Text style={styles.label}>Notes:</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Notes..."
            defaultValue={request.notes}
            editable={false}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => router.push({ pathname: '/AdminSendPickupNotice', params: { id: request._id } })}
            >
              <Text style={styles.approveText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
            >
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#225D30',
  },
  card: {
    backgroundColor: '#DCF5DD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#225D30',
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  notesInput: {
    backgroundColor: '#F5F5F5',
    height: 60,
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  approveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rejectText: {
    color: 'red',
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 12,
    height: 1,
    backgroundColor: '#C0C0C0',
  },
  backIcon: {
    position: 'absolute',
    left: 0,
    top: -4,
  },
});

export default AdminViewRequest;
