import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const homepage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>WasteWise</Text>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleHeader}>Schedule 1</Text>
        <Text style={styles.upcomingCollection}>Upcoming collection: March 22</Text>
        <Text style={styles.collectionType}>(Biodegradable)</Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Time: 9 am</Text>
          <Text style={styles.collectionInText}>▲ Collection in 2 days</Text>
        </View>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Request Pickup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'green',
  },
  scheduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upcomingCollection: {
    fontSize: 16,
    marginBottom: 4,
  },
  collectionType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  timeContainer: {
    marginBottom: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  collectionInText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default homepage;