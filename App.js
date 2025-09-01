// 📁 App.js

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas
import ChangePasswordScreen from './src/features/auth/screens/ChangePasswordScreen';
import FacebookRegisterScreen from './src/features/auth/screens/FacebookRegisterScreen';
import ForgotPasswordScreen from './src/features/auth/screens/ForgotPasswordScreen';
import GoogleRegisterScreen from './src/features/auth/screens/GoogleRegisterScreen';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import PatientRegisterScreen from './src/features/auth/screens/PatientRegisterScreen';
import SplashScreen from './src/features/auth/screens/SplashScreen';
import ValidateCodeScreen from './src/features/auth/screens/ValidateCodeScreen';
import CaregiverListScreen from './src/features/caregivers/screens/CaregiverListScreen';
import ConsultationListScreen from './src/features/consultations/screens/ConsultationListScreen';
import ExamListScreen from './src/features/exams/screens/ExamListScreen';
import HomeScreen from './src/features/home/screens/HomeScreen';
import MedicationListScreen from './src/features/medications/screens/MedicationListScreen';
import NotificationScreen from './src/features/notifications/screens/NotificationScreen';
import BloodTypeScreen from './src/features/profile/screens/BloodTypeScreen';
import UserProfileScreen from './src/features/profile/screens/UserProfileScreen';
import TreatmentListScreen from './src/features/treatments/screens/TreatmentListScreen';
import AddVaccineScreen from './src/features/vaccines/screens/AddVaccineScreen';
import EditVaccineScreen from './src/features/vaccines/screens/EditVaccineScreen';
import VaccineHistoryScreen from './src/features/vaccines/screens/VaccineHistoryScreen';

import CEMListScren from './src/features/cem/screens/CEMListScreen';
import ViewCEMMedicationsScreen from './src/features/cem/screens/ViewCEMMedicationsScreen';
import AddCEMMedicationScreen from './src/features/cem/screens/AddCEMMedicationScreen';
import EditCEMMedicationScreen from './src/features/cem/screens/EditCEMMedicationScreen';

// Componente customizado de navegação lateral
import CustomDrawerContent from './src/components/navigation/CustomDrawerContent';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * Drawer contendo a Home e menu lateral personalizado
 */
function HomeDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#ffffff',
        },
        drawerActiveTintColor: '#2e7d32',
      }}
    >
      {/* rotas */}
      <Drawer.Screen name="Início" component={HomeScreen} />
      <Drawer.Screen name="Perfil" component={UserProfileScreen} />
      <Drawer.Screen name="Troca de Senha" component={ChangePasswordScreen} />
      <Drawer.Screen name="Tipo Sanguíneo" component={BloodTypeScreen} />
      <Drawer.Screen name="Notificações" component={NotificationScreen} />
      <Drawer.Screen name="Vacinas" component={VaccineHistoryScreen} />
      <Stack.Screen name="Cuidadores" component={CaregiverListScreen} />
    </Drawer.Navigator>
  );
}

/**
 * Navegação principal do app MediWay - Paciente
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ValidateCode" component={ValidateCodeScreen} />
          <Stack.Screen name="GoogleRegister" component={GoogleRegisterScreen} />
          <Stack.Screen name="FacebookRegister" component={FacebookRegisterScreen} />
          <Stack.Screen name="Register" component={PatientRegisterScreen} />
          <Stack.Screen name="Home" component={HomeDrawer} />
          <Stack.Screen name="Adicionar Vacina" component={AddVaccineScreen} />
          <Stack.Screen name="Editar Vacina" component={EditVaccineScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Tratamentos" component={TreatmentListScreen} />
          <Stack.Screen name="Consultas" component={ConsultationListScreen} />
          <Stack.Screen name="Exames" component={ExamListScreen} />
          <Stack.Screen name="Medicamentos" component={MedicationListScreen} />
          <Stack.Screen name="CEM" component={CEMListScren} />
          <Stack.Screen
            name="Visualizar Medicamentos CEM"
            component={ViewCEMMedicationsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Adicionar Medicamento CEM" component={AddCEMMedicationScreen} />
          <Stack.Screen name="Editar Medicamento CEM" component={EditCEMMedicationScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
