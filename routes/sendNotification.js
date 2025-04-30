// sendNotification.js
const admin = require('./firebase');

async function sendPickupNotification(deviceToken, schedule) {
  const message = {
    token: deviceToken,
    notification: {
      title: `🚛 ${schedule.wasteType} Pickup`,
      body: `Scheduled at ${schedule.time} on ${schedule.day}`,
    },
    data: {
      _id: schedule._id,
      type: schedule.wasteType,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully:', response);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
}

module.exports = sendPickupNotification;
