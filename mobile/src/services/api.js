import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import NetInfo from '@react-native-community/netinfo';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your server URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await EncryptedStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      try {
        await EncryptedStorage.removeItem('auth_token');
        // Navigate to login screen
        // This would typically be handled by the auth context
      } catch (e) {
        console.error('Error removing token:', e);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  verifyAadhaar: (aadhaarNumber, otp) => api.post('/auth/verify-aadhaar', { aadhaarNumber, otp }),
  sendAadhaarOTP: (aadhaarNumber) => api.post('/auth/send-aadhaar-otp', { aadhaarNumber }),
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: (params) => api.get('/appointments', { params }),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  cancelAppointment: (id, reason) => api.post(`/appointments/${id}/cancel`, { reason }),
  rescheduleAppointment: (id, newDate, newTime, reason) => 
    api.post(`/appointments/${id}/reschedule`, { newDate, newTime, reason }),
  completeAppointment: (id, consultationData) => 
    api.post(`/appointments/${id}/complete`, consultationData),
  getUpcomingAppointments: (params) => api.get('/appointments/upcoming', { params }),
  getAppointmentHistory: (params) => api.get('/appointments/history', { params }),
};

// Prescriptions API
export const prescriptionsAPI = {
  getPrescriptions: (params) => api.get('/prescriptions', { params }),
  getPrescription: (id) => api.get(`/prescriptions/${id}`),
  createPrescription: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  updatePrescription: (id, prescriptionData) => api.put(`/prescriptions/${id}`, prescriptionData),
  issuePrescription: (id, signature) => api.post(`/prescriptions/${id}/issue`, { signature }),
  dispensePrescription: (id, dispensingData) => 
    api.post(`/prescriptions/${id}/dispense`, dispensingData),
  getPrescriptionHistory: (params) => api.get('/prescriptions/history', { params }),
  downloadPrescription: (id) => api.get(`/prescriptions/${id}/download`, { responseType: 'blob' }),
};

// Doctors API
export const doctorsAPI = {
  getDoctors: (params) => api.get('/doctors', { params }),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  getNearbyDoctors: (latitude, longitude, radius = 10) => 
    api.get('/doctors/nearby', { params: { latitude, longitude, radius } }),
  getDoctorAvailability: (id, date) => 
    api.get(`/doctors/${id}/availability`, { params: { date } }),
  getDoctorReviews: (id) => api.get(`/doctors/${id}/reviews`),
  bookAppointment: (appointmentData) => api.post('/appointments', appointmentData),
};

// Medicines API
export const medicinesAPI = {
  getMedicines: (params) => api.get('/medicines', { params }),
  getMedicine: (id) => api.get(`/medicines/${id}`),
  searchMedicines: (query, filters) => api.get('/medicines/search', { params: { query, ...filters } }),
  getMedicineDetails: (id) => api.get(`/medicines/${id}/details`),
  getMedicineInteractions: (medicineIds) => 
    api.post('/medicines/interactions', { medicineIds }),
  getDosageInfo: (medicineId, age, weight) => 
    api.get(`/medicines/${medicineId}/dosage`, { params: { age, weight } }),
};

// Chemists API
export const chemistsAPI = {
  getChemists: (params) => api.get('/chemists', { params }),
  getChemist: (id) => api.get(`/chemists/${id}`),
  getNearbyChemists: (latitude, longitude, radius = 5) => 
    api.get('/chemists/nearby', { params: { latitude, longitude, radius } }),
  getChemistInventory: (id) => api.get(`/chemists/${id}/inventory`),
  checkMedicineAvailability: (chemistId, medicineId) => 
    api.get(`/chemists/${chemistId}/medicines/${medicineId}/availability`),
  placeOrder: (orderData) => api.post('/orders', orderData),
  getOrderStatus: (orderId) => api.get(`/orders/${orderId}/status`),
};

// User API
export const userAPI = {
  updateProfile: (userData) => api.put('/users/profile', userData),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  uploadProfileImage: (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    return api.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getHealthRecords: (params) => api.get('/users/health-records', { params }),
  addHealthRecord: (recordData) => api.post('/users/health-records', recordData),
  updateHealthRecord: (id, recordData) => api.put(`/users/health-records/${id}`, recordData),
  deleteHealthRecord: (id) => api.delete(`/users/health-records/${id}`),
};

// Dosha Assessment API
export const doshaAPI = {
  getAssessmentQuestions: () => api.get('/dosha/assessment-questions'),
  submitAssessment: (answers) => api.post('/dosha/assessment', { answers }),
  getDoshaProfile: () => api.get('/dosha/profile'),
  updateDoshaProfile: (profile) => api.put('/dosha/profile', profile),
  getDoshaRecommendations: () => api.get('/dosha/recommendations'),
};

// Panchakarma API
export const panchakarmaAPI = {
  getTherapies: (params) => api.get('/panchakarma/therapies', { params }),
  getTherapyDetails: (id) => api.get(`/panchakarma/therapies/${id}`),
  bookTherapy: (therapyData) => api.post('/panchakarma/book', therapyData),
  getTherapyHistory: (params) => api.get('/panchakarma/history', { params }),
  getTherapyProgress: (therapyId) => api.get(`/panchakarma/therapies/${therapyId}/progress`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  updateNotificationPreferences: (preferences) => 
    api.put('/notifications/preferences', preferences),
};

// File Upload API
export const uploadAPI = {
  uploadImage: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadDocument: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Offline API (for local storage)
export const offlineAPI = {
  saveData: async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  },
  
  getData: async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  },
  
  removeData: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  },
  
  clearAllData: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },
};

// Network status helper
export const checkNetworkStatus = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected;
};

export default api;