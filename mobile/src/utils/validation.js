// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

// Phone number validation (Indian format)
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Aadhaar number validation
export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/\D/g, ''));
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  };
};

// Name validation
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Pincode validation (Indian format)
export const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode.replace(/\D/g, ''));
};

// Age validation
export const validateAge = (age) => {
  const numAge = parseInt(age);
  return numAge >= 0 && numAge <= 150;
};

// Date validation
export const validateDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  return inputDate <= today && inputDate.getFullYear() >= 1900;
};

// Blood group validation
export const validateBloodGroup = (bloodGroup) => {
  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validBloodGroups.includes(bloodGroup);
};

// Gender validation
export const validateGender = (gender) => {
  const validGenders = ['male', 'female', 'other'];
  return validGenders.includes(gender.toLowerCase());
};

// OTP validation
export const validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// Medicine dosage validation
export const validateDosage = (dosage) => {
  const dosageRegex = /^\d+(\.\d+)?\s*(mg|g|ml|drops|tablets|capsules|spoons)$/i;
  return dosageRegex.test(dosage);
};

// Consultation fee validation
export const validateConsultationFee = (fee) => {
  const numFee = parseFloat(fee);
  return numFee >= 0 && numFee <= 10000;
};

// Rating validation
export const validateRating = (rating) => {
  const numRating = parseFloat(rating);
  return numRating >= 1 && numRating <= 5;
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File size validation (in MB)
export const validateFileSize = (fileSize, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};

// Image file validation
export const validateImageFile = (fileName) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return validExtensions.includes(extension);
};

// Document file validation
export const validateDocumentFile = (fileName) => {
  const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return validExtensions.includes(extension);
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }
    
    if (value && rules.validator) {
      const isValid = rules.validator(value);
      if (!isValid) {
        errors[field] = rules.message || `${field} is invalid`;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    validator: validateEmail,
    message: 'Please enter a valid email address',
  },
  phone: {
    required: true,
    validator: validatePhone,
    message: 'Please enter a valid 10-digit mobile number',
  },
  password: {
    required: true,
    validator: (password) => validatePassword(password).isValid,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  },
  name: {
    required: true,
    validator: validateName,
    message: 'Name must be 2-50 characters and contain only letters',
  },
  aadhaar: {
    required: false,
    validator: validateAadhaar,
    message: 'Aadhaar number must be 12 digits',
  },
  pincode: {
    required: true,
    validator: validatePincode,
    message: 'Pincode must be 6 digits',
  },
  age: {
    required: true,
    validator: validateAge,
    message: 'Age must be between 0 and 150',
  },
  dateOfBirth: {
    required: true,
    validator: validateDate,
    message: 'Please enter a valid date of birth',
  },
  bloodGroup: {
    required: true,
    validator: validateBloodGroup,
    message: 'Please select a valid blood group',
  },
  gender: {
    required: true,
    validator: validateGender,
    message: 'Please select a valid gender',
  },
  otp: {
    required: true,
    validator: validateOTP,
    message: 'OTP must be 6 digits',
  },
};

export default {
  validateEmail,
  validatePhone,
  validateAadhaar,
  validatePassword,
  validateName,
  validatePincode,
  validateAge,
  validateDate,
  validateBloodGroup,
  validateGender,
  validateOTP,
  validateDosage,
  validateConsultationFee,
  validateRating,
  validateURL,
  validateFileSize,
  validateImageFile,
  validateDocumentFile,
  validateForm,
  commonValidationRules,
};