import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

type CustomAlertProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const AdminViewRequest = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [requestIdToReject, setRequestIdToReject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios
      .get('https://wastewise-app.onrender.com/request-pickup/admin/requests')
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load requests');
        setLoading(false);
      });
  }, []);

  const handleReject = (id: string) => {
    setRequestIdToReject(id);
    setShowModal(true);
  };

  const handleConfirmReject = async () => {
    try {
      await axios.put(
        `https://wastewise-app.onrender.com/request-pickup/admin/requests/${requestIdToReject}/decision`,
        {
          status: 'Rejected',
          admin_confirmed_date: null,
          admin_confirmed_time: null,
        }
      );

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestIdToReject)
      );

      setShowModal(false);
      setFeedbackMessage('Request has been rejected.');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } catch (error) {
      console.error('Reject API error:', error);
      setShowModal(false);
    }
  };

  const CustomAlert = ({ visible, onClose, onConfirm }: CustomAlertProps) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to reject this request?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.modalButton, styles.modalButtonCancel]}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onConfirm}
                style={[styles.modalButton, styles.modalButtonConfirm]}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#225D30" />;
  if (error)
    return <Text style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      {feedbackMessage !== '' && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </View>
      )}

      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push('/adminDashboard')}>
            <Ionicons name="chevron-back" size={28} color="#225D30" />
          </TouchableOpacity>
          <Text style={styles.header}>Pickup Requests</Text>
          <View style={{ width: 28 }} />
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
                onPress={() =>
                  router.push({
                    pathname: '/adminSendPickupNotice',
                    params: { id: request._id },
                  })
                }
              >
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleReject(request._id)}
                style={styles.rejectButton}
              >
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>

      <CustomAlert
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReject}
      />
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#225D30',
    textAlign: 'center',
    flex: 1,
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
  rejectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#2E8B57',
  },
  modalButtonConfirm: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  feedbackContainer: {
    backgroundColor: '#DFF2BF',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackText: {
    color: '#4F8A10',
    fontWeight: 'bold',
  },
});

export default AdminViewRequest;
