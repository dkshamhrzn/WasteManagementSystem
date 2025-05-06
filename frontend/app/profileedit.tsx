import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

export default function ProfileEditUI() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Image source={require('../assets/images/Back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: 'https://i.imgur.com/MK3eW3As.jpg' }}
              style={styles.profileImage}
            />
            <Image
              source={require('../assets/images/Edit.png')}
              style={styles.editIcon}
            />
          </View>

          <Text style={styles.title}>Edit profile</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} keyboardType="phone-pad" />

            <Text style={styles.label}>Location</Text>
            <TextInput style={styles.input} />
          </View>

          <TouchableOpacity style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  card: {
    width: 340,
    backgroundColor: '#E9F5E1',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 103,
    height: 106,
    borderRadius: 53,
  },
  editIcon: {
    position: 'absolute',
    right: -5,
    top: 70,
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginLeft: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#69A569',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: '#2F8F2F',
    width: 172,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
