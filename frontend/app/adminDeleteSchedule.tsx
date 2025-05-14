import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

const DeleteScheduleScreen = () => {
  const [id, setId] = useState('');
  const [showModal, setShowModal] = useState(false);

  const confirmDelete = () => {
    // Actual delete logic goes here (API/local)
    console.log('Deleted ID:', id);
    setShowModal(false);
    setId(''); // Clear input after deletion
  };

  const handleDeletePress = () => {
    if (id.trim() !== '') {
      setShowModal(true);
    } else {
      alert('Please enter an ID first.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete schedule</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Enter ID that you want to delete:</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={id}
          onChangeText={setId}
        />
        <TouchableOpacity style={styles.button} onPress={handleDeletePress}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />

      {/* Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Are you sure you want to delete?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d6a4f',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#e6f4e6',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '85%',
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
    color: '#000000',
  },
  input: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  bottomSpacer: {
    backgroundColor: '#e6f4e6',
    height: 40,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 10,
    width: '75%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#d62828',
  },
  noButton: {
    backgroundColor: '#2d6a4f',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
