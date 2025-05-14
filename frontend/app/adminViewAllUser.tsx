import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const adminViewAllUser = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({ users: [], count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://wastewise-app.onrender.com/get-profile/all')
      .then(res => res.json())
      .then(data => {
        setUserData({ users: data.users, count: data.count });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="green" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All users</Text>
      </View>

      {/* Card Wrapper */}
      <View style={styles.cardWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Total Users Count */}
            <Text style={styles.totalText}>Total Users: {userData.count}</Text>

            {/* Users List */}
            {userData.users.map((user: any, index: number) => (
              <View key={user._id || index} style={styles.card}>
                <Text style={styles.label}>
                  ID: <Text style={styles.value}>{user._id}</Text>
                </Text>
                <Text style={styles.label}>
                  Name: <Text style={[styles.value, { color: '#1e90ff' }]}>{user.full_name}</Text>
                </Text>
                <Text style={styles.label}>
                  Email: <Text style={[styles.value, { color: '#ff6347' }]}>{user.email}</Text>
                </Text>
                <Text style={styles.label}>
                  Phone number: <Text style={[styles.value, { color: '#8a2be2' }]}>{user.phone_number}</Text>
                </Text>
                <Text style={styles.label}>
                  Address: <Text style={[styles.value, { color: '#2e8b57' }]}>{user.address}</Text>
                </Text>
                {index < userData.users.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#225D30',
  },
  backIcon: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 10,
  },
  cardWrapper: {
    backgroundColor: '#E4F1DE',
    marginHorizontal: 15,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  totalText: {
    fontSize: 16,
    color: 'green',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'normal',
    color: '#333333',
  },
  separator: {
    height: 1,
    backgroundColor: '#b7d5b3',
    marginTop: 10,
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#dff0dc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default adminViewAllUser;
