import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>WasteWise</Text>
      <Text style={styles.title}>Welcome Admin</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Image source={require('../assets/images/Delivery.png')} style={styles.icon} />
          <TouchableOpacity style={styles.button} onPress={() => router.push('/adminManageSchedule')}>
            <Text style={styles.buttonText}>Manage schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Image source={require('../assets/images/Clock2.png')} style={styles.icon} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send truck</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cardSingle}>
          <Image source={require('../assets/images/Bar.png')} style={styles.icon} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Statistics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Admin Panel</Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    color: '#1B5E20',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    margin: 10,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardSingle: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    margin: 10,
    width: 150,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    borderRadius: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
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
