import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import adminViewallSchedule from './adminViewallSchedule';


export default function ViewScheduleScreen() {
  const [selectedType, setSelectedType] = useState('Biodegradable');
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleView = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://wastewise-app.onrender.com/truck-schedules/all-schedules');
      const data = await response.json();

      const filtered = data.filter((item: any) => item.wasteType === selectedType);
      setFilteredSchedules(filtered);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const givenDate = new Date(dateString);
    return today.toDateString() === givenDate.toDateString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
    if (Platform.OS === "android") {
      ToastAndroid.show("ID copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied", "ID copied to clipboard!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={require('../assets/images/Back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>View Schedule</Text>
      </View>

      {/* Filter Card */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/adminViewallSchedule')}
        >
          <Text style={styles.buttonText}>View All</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>View by Type:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              value={selectedType}
              onValueChange={(value) => setSelectedType(value)}
              items={[
                { label: 'Biodegradable', value: 'Biodegradable' },
                { label: 'Non-Biodegradable', value: 'Non-Biodegradable' },
                { label: 'Recyclable', value: 'Recyclable' },
              ]}
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
                inputWeb: styles.picker,
              }}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleView}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule Results */}
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 30 }} />
      ) : showResults && filteredSchedules.length === 0 ? (
        <Text style={{ marginTop: 20, color: 'gray' }}>No schedules found.</Text>
      ) : (
        <ScrollView style={{ marginTop: 20, width: '85%' }} contentContainerStyle={{ paddingBottom: 100 }}>
          {filteredSchedules.map((item, index) => (
            <View key={index} style={styles.scheduleCard}>
              <TouchableOpacity onPress={() => copyToClipboard(item._id)}>
                <Text style={[styles.text, styles.idText]}>
                  🔗 ID: {item._id} (Tap to copy)
                </Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <Image
                  source={require('../assets/images/Calendar.png')}
                  style={styles.icon}
                />
                <Text style={styles.text}>{formatDate(item.date)}</Text>
              </View>

              <View style={styles.row}>
                <Image
                  source={require('../assets/images/Bin.png')}
                  style={styles.icon}
                />
                <Text style={styles.text}>Waste Type: {item.wasteType}</Text>
              </View>

              <View style={styles.row}>
                <Image
                  source={require('../assets/images/Clock.png')}
                  style={styles.icon}
                />
                <Text style={styles.text}>Time: {item.time}</Text>
              </View>

              <View style={styles.row}>
                <Image
                  source={require('../assets/images/Check.png')}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.text,
                    isToday(item.date)
                      ? styles.statusUpcoming
                      : item.status === 'Completed'
                      ? styles.statusComplete
                      : styles.statusNormal,
                  ]}
                >
                  Status: {isToday(item.date) ? "Today's Collection" : item.status}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  card: {
    backgroundColor: '#e3f2e1',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    marginLeft: 10,
  },
  picker: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  scheduleCard: {
    width: '100%',
    backgroundColor: '#E4F1DE',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 14,
    color: 'green',
    fontWeight: '500',
    flexShrink: 1,
  },
  idText: {
    fontSize: 12,
    color: '#444',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statusUpcoming: {
    color: 'red',
    fontWeight: 'bold',
  },
  statusComplete: {
    color: 'gray',
    fontWeight: 'bold',
  },
  statusNormal: {
    color: 'green',
  },
});