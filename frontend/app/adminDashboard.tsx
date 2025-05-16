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
          <Image source={require('../assets/images/Clock.png')} style={styles.icon} />
          <TouchableOpacity style={styles.button} onPress={() => router.push('/adminManageSchedule')}>
            <Text style={styles.buttonText}>Manage schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Image source={require('../assets/images/Delivery.png')} style={styles.icon} />
          <TouchableOpacity style={styles.button} onPress={() => router.push('/adminViewRequest')}>
            <Text style={styles.buttonText}>Pickup request</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.cardSingle}>
          <Image source={require('../assets/images/Bar.png')} style={styles.icon} />
          <TouchableOpacity style={styles.button} onPress={() => router.push('/adminViewAllUser')}>
            <Text style={styles.buttonText}>View User</Text>
          </TouchableOpacity>
        </View>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#fff',
  paddingTop: 60,
  paddingBottom: 40,
  alignItems: 'center',
  justifyContent: 'flex-start',
},
card: {
  backgroundColor: '#ffffff',
  borderRadius: 20,
  paddingVertical: 25,
  paddingHorizontal: 15,
  margin: 10,
  width: 160,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
  borderWidth: 1,
  borderColor: '#C8E6C9',
},
cardSingle: {
  backgroundColor: '#ffffff',
  borderRadius: 20,
  paddingVertical: 25,
  paddingHorizontal: 15,
  margin: 10,
  width: 160,
  alignItems: 'center',
  alignSelf: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
  borderWidth: 1,
  borderColor: '#C8E6C9',
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
    height: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  navbarText: {
    color: '#2E7D32',
    fontWeight: '500',
    fontSize: 12,
  },
});
