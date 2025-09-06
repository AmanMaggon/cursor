import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from 'react-native-flash-message';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

// Context Providers
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { OfflineProvider } from './src/contexts/OfflineContext';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import OtpVerificationScreen from './src/screens/auth/OtpVerificationScreen';
import AadhaarVerificationScreen from './src/screens/auth/AadhaarVerificationScreen';

// Patient Screens
import PatientDashboard from './src/screens/patient/DashboardScreen';
import PatientProfile from './src/screens/patient/ProfileScreen';
import BookAppointment from './src/screens/patient/BookAppointmentScreen';
import MyAppointments from './src/screens/patient/MyAppointmentsScreen';
import MyPrescriptions from './src/screens/patient/MyPrescriptionsScreen';
import MedicineReminder from './src/screens/patient/MedicineReminderScreen';
import DoshaAssessment from './src/screens/patient/DoshaAssessmentScreen';
import PanchakarmaTherapy from './src/screens/patient/PanchakarmaTherapyScreen';
import FindDoctors from './src/screens/patient/FindDoctorsScreen';
import FindChemists from './src/screens/patient/FindChemistsScreen';
import HealthRecords from './src/screens/patient/HealthRecordsScreen';
import EmergencyContacts from './src/screens/patient/EmergencyContactsScreen';
import SettingsScreen from './src/screens/patient/SettingsScreen';

// Doctor Screens
import DoctorDashboard from './src/screens/doctor/DashboardScreen';
import DoctorProfile from './src/screens/doctor/ProfileScreen';
import DoctorAppointments from './src/screens/doctor/AppointmentsScreen';
import CreatePrescription from './src/screens/doctor/CreatePrescriptionScreen';
import PatientHistory from './src/screens/doctor/PatientHistoryScreen';
import DoctorSettings from './src/screens/doctor/SettingsScreen';

// Chemist Screens
import ChemistDashboard from './src/screens/chemist/DashboardScreen';
import ChemistProfile from './src/screens/chemist/ProfileScreen';
import InventoryManagement from './src/screens/chemist/InventoryScreen';
import PrescriptionOrders from './src/screens/chemist/PrescriptionOrdersScreen';
import OrderFulfillment from './src/screens/chemist/OrderFulfillmentScreen';
import ChemistSettings from './src/screens/chemist/SettingsScreen';

// Common Components
import LoadingScreen from './src/components/common/LoadingScreen';
import OfflineScreen from './src/components/common/OfflineScreen';
import CustomDrawer from './src/components/common/CustomDrawer';
import CustomTabBar from './src/components/common/CustomTabBar';

// Utils
import { requestPermissions } from './src/utils/permissions';
import { initializeApp } from './src/utils/initialization';

// Create navigation stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Patient Tab Navigator
const PatientTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} userType="patient" />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="PatientDashboard" component={PatientDashboard} />
    <Tab.Screen name="FindDoctors" component={FindDoctors} />
    <Tab.Screen name="MyAppointments" component={MyAppointments} />
    <Tab.Screen name="MyPrescriptions" component={MyPrescriptions} />
    <Tab.Screen name="PatientProfile" component={PatientProfile} />
  </Tab.Navigator>
);

// Doctor Tab Navigator
const DoctorTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} userType="doctor" />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="DoctorDashboard" component={DoctorDashboard} />
    <Tab.Screen name="DoctorAppointments" component={DoctorAppointments} />
    <Tab.Screen name="CreatePrescription" component={CreatePrescription} />
    <Tab.Screen name="PatientHistory" component={PatientHistory} />
    <Tab.Screen name="DoctorProfile" component={DoctorProfile} />
  </Tab.Navigator>
);

// Chemist Tab Navigator
const ChemistTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} userType="chemist" />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="ChemistDashboard" component={ChemistDashboard} />
    <Tab.Screen name="PrescriptionOrders" component={PrescriptionOrders} />
    <Tab.Screen name="InventoryManagement" component={InventoryManagement} />
    <Tab.Screen name="OrderFulfillment" component={OrderFulfillment} />
    <Tab.Screen name="ChemistProfile" component={ChemistProfile} />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    initializeApp();
    
    // Request permissions
    requestPermissions();
    
    // Check network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    // Hide splash screen
    setTimeout(() => {
      SplashScreen.hide();
      setIsLoading(false);
    }, 2000);

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isOffline) {
    return <OfflineScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="AadhaarVerification" component={AadhaarVerificationScreen} />

        {/* Patient Stack */}
        <Stack.Screen name="PatientMain" component={PatientTabNavigator} />
        <Stack.Screen name="BookAppointment" component={BookAppointment} />
        <Stack.Screen name="DoshaAssessment" component={DoshaAssessment} />
        <Stack.Screen name="PanchakarmaTherapy" component={PanchakarmaTherapy} />
        <Stack.Screen name="MedicineReminder" component={MedicineReminder} />
        <Stack.Screen name="FindChemists" component={FindChemists} />
        <Stack.Screen name="HealthRecords" component={HealthRecords} />
        <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
        <Stack.Screen name="PatientSettings" component={SettingsScreen} />

        {/* Doctor Stack */}
        <Stack.Screen name="DoctorMain" component={DoctorTabNavigator} />
        <Stack.Screen name="DoctorSettings" component={DoctorSettings} />

        {/* Chemist Stack */}
        <Stack.Screen name="ChemistMain" component={ChemistTabNavigator} />
        <Stack.Screen name="ChemistSettings" component={ChemistSettings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <OfflineProvider>
              <PaperProvider>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor="#ffffff"
                  translucent={false}
                />
                <AppNavigator />
                <FlashMessage position="top" />
                <Toast />
              </PaperProvider>
            </OfflineProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;