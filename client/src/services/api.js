import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  verifyAadhaar: (aadhaarNumber, otp) => api.post('/auth/verify-aadhaar', { aadhaarNumber, otp }),
  sendAadhaarOTP: (aadhaarNumber) => api.post('/auth/send-aadhaar-otp', { aadhaarNumber }),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  verifyUser: (id) => api.post(`/users/${id}/verify`),
  suspendUser: (id, reason) => api.post(`/users/${id}/suspend`, { reason }),
  activateUser: (id) => api.post(`/users/${id}/activate`),
  getUserStats: () => api.get('/users/stats'),
};

// Doctors API
export const doctorsAPI = {
  getDoctors: (params) => api.get('/doctors', { params }),
  getDoctor: (id) => api.get(`/doctors/${id}`),
  createDoctor: (doctorData) => api.post('/doctors', doctorData),
  updateDoctor: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
  verifyDoctor: (id) => api.post(`/doctors/${id}/verify`),
  approveDoctor: (id) => api.post(`/doctors/${id}/approve`),
  rejectDoctor: (id, reason) => api.post(`/doctors/${id}/reject`, { reason }),
  getDoctorStats: () => api.get('/doctors/stats'),
  getDoctorAppointments: (id, params) => api.get(`/doctors/${id}/appointments`, { params }),
  getDoctorPrescriptions: (id, params) => api.get(`/doctors/${id}/prescriptions`, { params }),
};

// Chemists API
export const chemistsAPI = {
  getChemists: (params) => api.get('/chemists', { params }),
  getChemist: (id) => api.get(`/chemists/${id}`),
  createChemist: (chemistData) => api.post('/chemists', chemistData),
  updateChemist: (id, chemistData) => api.put(`/chemists/${id}`, chemistData),
  deleteChemist: (id) => api.delete(`/chemists/${id}`),
  verifyChemist: (id) => api.post(`/chemists/${id}/verify`),
  approveChemist: (id) => api.post(`/chemists/${id}/approve`),
  rejectChemist: (id, reason) => api.post(`/chemists/${id}/reject`, { reason }),
  getChemistStats: () => api.get('/chemists/stats'),
  getChemistOrders: (id, params) => api.get(`/chemists/${id}/orders`, { params }),
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
  getAppointmentStats: () => api.get('/appointments/stats'),
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
  getPrescriptionStats: () => api.get('/prescriptions/stats'),
  getPrescriptionHistory: (params) => api.get('/prescriptions/history', { params }),
  downloadPrescription: (id) => api.get(`/prescriptions/${id}/download`, { responseType: 'blob' }),
};

// Medicines API
export const medicinesAPI = {
  getMedicines: (params) => api.get('/medicines', { params }),
  getMedicine: (id) => api.get(`/medicines/${id}`),
  createMedicine: (medicineData) => api.post('/medicines', medicineData),
  updateMedicine: (id, medicineData) => api.put(`/medicines/${id}`, medicineData),
  deleteMedicine: (id) => api.delete(`/medicines/${id}`),
  searchMedicines: (query, filters) => api.get('/medicines/search', { params: { query, ...filters } }),
  getMedicineStats: () => api.get('/medicines/stats'),
  updateStock: (id, quantity, operation) => 
    api.post(`/medicines/${id}/stock`, { quantity, operation }),
  getLowStockMedicines: () => api.get('/medicines/low-stock'),
  getExpiredMedicines: () => api.get('/medicines/expired'),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getUserAnalytics: (params) => api.get('/analytics/users', { params }),
  getDoctorAnalytics: (params) => api.get('/analytics/doctors', { params }),
  getAppointmentAnalytics: (params) => api.get('/analytics/appointments', { params }),
  getPrescriptionAnalytics: (params) => api.get('/analytics/prescriptions', { params }),
  getMedicineAnalytics: (params) => api.get('/analytics/medicines', { params }),
  getRevenueAnalytics: (params) => api.get('/analytics/revenue', { params }),
  getComplianceReport: (params) => api.get('/analytics/compliance', { params }),
  exportReport: (type, params) => api.get(`/analytics/export/${type}`, { 
    params, 
    responseType: 'blob' 
  }),
};

// Admin API
export const adminAPI = {
  getSystemStats: () => api.get('/admin/stats'),
  getSystemHealth: () => api.get('/admin/health'),
  getPendingVerifications: () => api.get('/admin/pending-verifications'),
  getComplianceStatus: () => api.get('/admin/compliance'),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  getSystemSettings: () => api.get('/admin/settings'),
  updateSystemSettings: (settings) => api.put('/admin/settings', settings),
  sendSystemNotification: (notification) => api.post('/admin/notifications', notification),
  backupDatabase: () => api.post('/admin/backup'),
  restoreDatabase: (backupFile) => api.post('/admin/restore', backupFile),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  sendNotification: (notificationData) => api.post('/notifications/send', notificationData),
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

export default api;