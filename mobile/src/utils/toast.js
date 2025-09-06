import Toast from 'react-native-toast-message';

export const showToast = (type, message, duration = 4000) => {
  Toast.show({
    type,
    text1: type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info',
    text2: message,
    visibilityTime: duration,
    position: 'top',
    topOffset: 60,
  });
};

export const showSuccessToast = (message) => {
  showToast('success', message);
};

export const showErrorToast = (message) => {
  showToast('error', message);
};

export const showInfoToast = (message) => {
  showToast('info', message);
};

export const showWarningToast = (message) => {
  showToast('info', message, 5000);
};

export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
};