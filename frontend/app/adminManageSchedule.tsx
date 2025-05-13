import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ManageScheduleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage schedule</Text>

      <ScrollView contentContainerStyle={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/adminCreateNewSchedule')}
        >
          <Text style={styles.buttonText}>Create a new schedule</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/adminViewSchedule')}
        >
          <Text style={styles.buttonText}>View Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.button}
        onPress={()=> router.push('/adminUpdateSchedule')}
        >
          <Text style={styles.buttonText}>Update schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.button}
        onPress={()=> router.push('/adminDeleteSchedule')}
        >
          <Text style={styles.buttonText}>Delete schedule</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Manage Schedule Panel</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: 250,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  navbar: {
    backgroundColor: '#E8F5E9',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navbarText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 16,
  },
});
