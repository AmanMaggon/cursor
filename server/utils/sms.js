const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SMS templates
const smsTemplates = {
  'otp-verification': 'Your AyurSutra verification code is: {{otp}}. Valid for 5 minutes. Do not share this code with anyone.',
  'appointment-confirmation': 'Your appointment with Dr. {{doctorName}} is confirmed for {{date}} at {{time}}. Appointment ID: {{appointmentId}}. AyurSutra',
  'appointment-reminder': 'Reminder: Your appointment with Dr. {{doctorName}} is tomorrow at {{time}}. Please arrive 15 minutes early. AyurSutra',
  'prescription-ready': 'Your prescription from Dr. {{doctorName}} is ready. Prescription ID: {{prescriptionId}}. Download from AyurSutra app.',
  'medicine-reminder': 'Reminder: Take {{medicineName}} {{dosage}} as prescribed by Dr. {{doctorName}}. AyurSutra',
  'payment-confirmation': 'Payment of ₹{{amount}} for {{service}} has been confirmed. Transaction ID: {{transactionId}}. AyurSutra',
  'emergency-alert': 'Emergency: {{message}}. Please contact your doctor immediately. AyurSutra'
};

// Replace template variables
const replaceTemplateVariables = (template, data) => {
  let message = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regex, value);
  }
  return message;
};

// Send SMS
const sendSMS = async ({ to, message, template, data = {} }) => {
  try {
    let smsMessage = message;
    
    // Use template if provided
    if (template && smsTemplates[template]) {
      smsMessage = replaceTemplateVariables(smsTemplates[template], data);
    }
    
    // Add Indian country code if not present
    if (!to.startsWith('+91')) {
      to = '+91' + to;
    }
    
    const result = await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log('SMS sent successfully:', result.sid);
    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send bulk SMS
const sendBulkSMS = async (smsList) => {
  const results = [];
  
  for (const sms of smsList) {
    try {
      const result = await sendSMS(sms);
      results.push({ phone: sms.to, success: result.success, messageId: result.messageId });
    } catch (error) {
      results.push({ phone: sms.to, success: false, error: error.message });
    }
  }
  
  return results;
};

// Send OTP SMS
const sendOTPSMS = async (phoneNumber, otp) => {
  return await sendSMS({
    to: phoneNumber,
    template: 'otp-verification',
    data: { otp }
  });
};

// Send appointment confirmation SMS
const sendAppointmentConfirmationSMS = async (phoneNumber, appointmentData) => {
  return await sendSMS({
    to: phoneNumber,
    template: 'appointment-confirmation',
    data: appointmentData
  });
};

// Send appointment reminder SMS
const sendAppointmentReminderSMS = async (phoneNumber, appointmentData) => {
  return await sendSMS({
    to: phoneNumber,
    template: 'appointment-reminder',
    data: appointmentData
  });
};

// Send prescription ready SMS
const sendPrescriptionReadySMS = async (phoneNumber, prescriptionData) => {
  return await sendSMS({
    to: phoneNumber,
    template: 'prescription-ready',
    data: prescriptionData
  });
};

// Send medicine reminder SMS
const sendMedicineReminderSMS = async (phoneNumber, medicineData) => {
  return await sendSMS({
    to: phoneNumber,
    template: 'medicine-reminder',
    data: medicineData
  });
};

// Send payment confirmation SMS
const sendPaymentConfirmationSMS = async (phoneNumber, paymentData) => {
  return await sendSMS({
    to: phoneNumber,
    template: 'payment-confirmation',
    data: paymentData
  });
};

// Send emergency alert SMS
const sendEmergencyAlertSMS = async (phoneNumber, message) => {
  return await sendSMS({
    to: phoneNumber,
    template: 'emergency-alert',
    data: { message }
  });
};

// Validate phone number
const validatePhoneNumber = (phoneNumber) => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  if (cleaned.length === 10 && indianMobileRegex.test(cleaned)) {
    return '+91' + cleaned;
  }
  
  // Check if it's already in international format
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return '+' + cleaned;
  }
  
  return null;
};

// Get SMS delivery status
const getSMSStatus = async (messageId) => {
  try {
    const message = await client.messages(messageId).fetch();
    return {
      success: true,
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage
    };
  } catch (error) {
    console.error('Get SMS status error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Schedule SMS (for reminders)
const scheduleSMS = async ({ to, message, template, data, sendAt }) => {
  try {
    let smsMessage = message;
    
    if (template && smsTemplates[template]) {
      smsMessage = replaceTemplateVariables(smsTemplates[template], data);
    }
    
    if (!to.startsWith('+91')) {
      to = '+91' + to;
    }
    
    // Note: Twilio doesn't support scheduled SMS directly
    // This would need to be implemented with a job queue system
    // For now, we'll just send immediately
    const result = await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log('Scheduled SMS sent:', result.sid);
    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Schedule SMS error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendOTPSMS,
  sendAppointmentConfirmationSMS,
  sendAppointmentReminderSMS,
  sendPrescriptionReadySMS,
  sendMedicineReminderSMS,
  sendPaymentConfirmationSMS,
  sendEmergencyAlertSMS,
  validatePhoneNumber,
  getSMSStatus,
  scheduleSMS,
  smsTemplates
};