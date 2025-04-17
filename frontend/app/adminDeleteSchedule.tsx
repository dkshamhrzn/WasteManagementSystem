import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from 'react-native';

const DeleteScheduleScreen: React.FC = () => {
  const [id, setId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const validateId = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setInputError('ID is required');
      return false;
    }
    if (!/^[a-f\d]{24}$/i.test(trimmed)) {
      setInputError('Invalid ID format (must be 24-character hex)');
      return false;
    }
    setInputError(null);
    return true;
  };

  const handleDeletePress = () => {
    setNetworkError(null);
    if (validateId(id)) {
      setShowModal(true);
    }
  };

  const confirmDelete = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setNetworkError(null);

    try {
      const response = await fetch(
        `https://wastewise-app.onrender.com/truck-schedules/${id.trim()}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Unexpected response format');
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Schedule not found for the given ID');
        } else if (response.status === 400) {
          throw new Error(data.message || 'Invalid request');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data.message || `Error: ${response.status}`);
        }
      }

      Alert.alert('Success', data.message || 'Schedule deleted successfully', [
        {
          text: 'OK',
          onPress: () => {
            setId('');
            setShowModal(false);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Delete error:', error);
      let errorMessage = 'Failed to delete schedule';

      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Schedule not found or already deleted';
      } else if (error.message.includes('ObjectId')) {
        errorMessage = 'Invalid ID format (must be 24-character hex)';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setNetworkError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete Schedule</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Enter Schedule ID:</Text>
        <TextInput
          style={[styles.input, inputError ? { borderColor: '#d62828' } : null]}
          placeholder="e.g. 5f4dcc3b5aa765d61d8327de"
          placeholderTextColor="#999"
          value={id}
          onChangeText={(text) => {
            setId(text);
            setNetworkError(null);
            if (inputError) validateId(text);
          }}
          onBlur={() => validateId(id)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {inputError && <Text style={styles.errorText}>{inputError}</Text>}
        {networkError && <Text style={styles.errorText}>{networkError}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!id.trim() || isLoading) && styles.buttonDisabled,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleDeletePress}
          disabled={!id.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Delete</Text>
          )}
        </Pressable>
      </View>

      {/* Confirmation Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this schedule?
            </Text>
            <Text style={styles.modalSubtext}>
              This action cannot be undone.
            </Text>

            {networkError && (
              <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10 }]}>
                {networkError}
              </Text>
            )}

            {isLoading ? (
              <ActivityIndicator size="large" color="#2d6a4f" />
            ) : (
              <View style={styles.modalButtons}>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.noButton,
                    { opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={() => {
                    setShowModal(false);
                    setNetworkError(null);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.yesButton,
                    { opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={confirmDelete}
                  disabled={isLoading}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    elevation: 3,
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
    color: '#000000',
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#95b8a6',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
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
    fontWeight: '500',
  },
  modalSubtext: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
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
  errorText: {
    color: '#d62828',
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});

export default DeleteScheduleScreen;