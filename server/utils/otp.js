const crypto = require('crypto');

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiration
const storeOTP = (identifier, otp, expiresInMinutes = 5) => {
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  otpStorage.set(identifier, {
    otp,
    expiresAt,
    attempts: 0
  });
};

// Verify OTP
const verifyOTP = (identifier, otp) => {
  const stored = otpStorage.get(identifier);
  
  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }
  
  if (new Date() > stored.expiresAt) {
    otpStorage.delete(identifier);
    return { valid: false, message: 'OTP expired' };
  }
  
  if (stored.attempts >= 3) {
    otpStorage.delete(identifier);
    return { valid: false, message: 'Too many attempts. OTP invalidated.' };
  }
  
  if (stored.otp !== otp) {
    stored.attempts++;
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it
  otpStorage.delete(identifier);
  return { valid: true, message: 'OTP verified successfully' };
};

// Send OTP via SMS (mock implementation)
const sendOTP = async (phoneNumber, purpose = 'verification') => {
  try {
    const otp = generateOTP();
    const identifier = `${phoneNumber}_${purpose}`;
    
    // Store OTP
    storeOTP(identifier, otp);
    
    // In production, integrate with SMS service like Twilio, AWS SNS, etc.
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    // Mock SMS sending
    const smsSent = await sendSMS({
      to: phoneNumber,
      message: `Your AyurSutra verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`
    });
    
    return smsSent;
  } catch (error) {
    console.error('Send OTP error:', error);
    return false;
  }
};

// Send OTP via Email
const sendOTPEmail = async (email, purpose = 'verification') => {
  try {
    const otp = generateOTP();
    const identifier = `${email}_${purpose}`;
    
    // Store OTP
    storeOTP(identifier, otp);
    
    // Send email with OTP
    const emailSent = await sendEmail({
      to: email,
      subject: 'Your AyurSutra Verification Code',
      template: 'otp-verification',
      data: {
        otp,
        purpose: purpose.charAt(0).toUpperCase() + purpose.slice(1)
      }
    });
    
    return emailSent;
  } catch (error) {
    console.error('Send OTP email error:', error);
    return false;
  }
};

// Verify OTP for phone number
const verifyPhoneOTP = async (phoneNumber, otp, purpose = 'verification') => {
  const identifier = `${phoneNumber}_${purpose}`;
  return verifyOTP(identifier, otp);
};

// Verify OTP for email
const verifyEmailOTP = async (email, otp, purpose = 'verification') => {
  const identifier = `${email}_${purpose}`;
  return verifyOTP(identifier, otp);
};

// Clean expired OTPs (run periodically)
const cleanExpiredOTPs = () => {
  const now = new Date();
  for (const [identifier, data] of otpStorage.entries()) {
    if (now > data.expiresAt) {
      otpStorage.delete(identifier);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanExpiredOTPs, 5 * 60 * 1000);

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTP,
  sendOTPEmail,
  verifyPhoneOTP,
  verifyEmailOTP,
  cleanExpiredOTPs
};