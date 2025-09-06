import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { authAPI } from '../services/api';
import { showToast } from '../utils/toast';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_OFFLINE_MODE':
      return {
        ...state,
        isOffline: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
  isOffline: false,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await EncryptedStorage.getItem('auth_token');
      if (token) {
        const response = await authAPI.getProfile();
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token,
          },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await EncryptedStorage.removeItem('auth_token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      // Store token securely
      await EncryptedStorage.setItem('auth_token', token);
      
      // Store user preferences
      await AsyncStorage.setItem('user_preferences', JSON.stringify({
        language: user.preferences?.language || 'en',
        elderlyMode: user.preferences?.elderlyMode || false,
        notifications: user.preferences?.notifications || {
          email: true,
          sms: true,
          push: true,
        },
      }));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      
      showToast('success', `Welcome back, ${user.firstName}!`);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      showToast('error', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      // Store token securely
      await EncryptedStorage.setItem('auth_token', token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      
      showToast('success', 'Registration successful! Please verify your email.');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      showToast('error', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await EncryptedStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_preferences');
      dispatch({ type: 'LOGOUT' });
      showToast('success', 'Logged out successfully');
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Set offline mode
  const setOfflineMode = (isOffline) => {
    dispatch({ type: 'SET_OFFLINE_MODE', payload: isOffline });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Check if user is verified
  const isVerified = () => {
    return state.user?.isVerified;
  };

  // Check if user has Aadhaar verification
  const hasAadhaarVerification = () => {
    return state.user?.aadhaarVerified;
  };

  // Get user preferences
  const getUserPreferences = async () => {
    try {
      const preferences = await AsyncStorage.getItem('user_preferences');
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Get preferences error:', error);
      return null;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences) => {
    try {
      await AsyncStorage.setItem('user_preferences', JSON.stringify(preferences));
      updateUser({ preferences });
    } catch (error) {
      console.error('Update preferences error:', error);
    }
  };

  // Verify Aadhaar
  const verifyAadhaar = async (aadhaarNumber, otp) => {
    try {
      const response = await authAPI.verifyAadhaar(aadhaarNumber, otp);
      updateUser({
        aadhaarNumber,
        aadhaarVerified: true,
        aadhaarVerificationDate: new Date().toISOString(),
      });
      showToast('success', 'Aadhaar verified successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Aadhaar verification failed';
      showToast('error', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Send Aadhaar OTP
  const sendAadhaarOTP = async (aadhaarNumber) => {
    try {
      await authAPI.sendAadhaarOTP(aadhaarNumber);
      showToast('success', 'OTP sent to your registered mobile number');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      showToast('error', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
    setOfflineMode,
    hasRole,
    hasAnyRole,
    isVerified,
    hasAadhaarVerification,
    getUserPreferences,
    updateUserPreferences,
    verifyAadhaar,
    sendAadhaarOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;