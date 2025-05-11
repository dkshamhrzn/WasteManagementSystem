// testNotification.js
const sendPickupNotification = require('./sendNotification');

// Replace with a real device token from your React Native app
const deviceToken = 'YOUR_DEVICE_TOKEN_FROM_APP';

const schedule = {
  _id: '67e3efab3f652ed7092cbd5f',
  wasteType: 'Biodegradable',
  time: '8 AM',
  date: '2025-04-11',
  status: 'Scheduled',
  day: 'Friday',
};

sendPickupNotification(deviceToken, schedule);
