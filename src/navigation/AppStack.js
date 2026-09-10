// 📁 src/navigation/AppStack.js
//
// Fluxo autenticado, renderizado quando `status === 'signedIn'`.
// É o conteúdo que antes vivia direto no App.js (Drawer da Home + telas de
// feature), sem as telas de autenticação.

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChangePasswordScreen from '../features/auth/screens/ChangePasswordScreen';
import CaregiverListScreen from '../features/caregivers/screens/CaregiverListScreen';
import ConsultationListScreen from '../features/consultations/screens/ConsultationListScreen';
import ExamListScreen from '../features/exams/screens/ExamListScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import MedicationListScreen from '../features/medications/screens/MedicationListScreen';
import NotificationScreen from '../features/notifications/screens/NotificationScreen';
import BloodTypeScreen from '../features/profile/screens/BloodTypeScreen';
import UserProfileScreen from '../features/profile/screens/UserProfileScreen';
import TreatmentListScreen from '../features/treatments/screens/TreatmentListScreen';
import VaccineHistoryScreen from '../features/vaccines/screens/VaccineHistoryScreen';

import CEMListScreen from '../features/cem/screens/CEMListScreen';
import ViewCEMMedicationsScreen from '../features/cem/screens/ViewCEMMedicationsScreen';
import AddCEMMedicationScreen from '../features/cem/screens/AddCEMMedicationScreen';
import EditCEMMedicationScreen from '../features/cem/screens/EditCEMMedicationScreen';

import CustomDrawerContent from '../components/navigation/CustomDrawerContent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#ffffff' },
        drawerActiveTintColor: '#2e7d32',
      }}
    >
      <Drawer.Screen name="Início" component={HomeScreen} />
      <Drawer.Screen name="Perfil" component={UserProfileScreen} />
      <Drawer.Screen name="Troca de Senha" component={ChangePasswordScreen} />
      <Drawer.Screen name="Tipo Sanguíneo" component={BloodTypeScreen} />
      <Drawer.Screen name="Notificações" component={NotificationScreen} />
      <Drawer.Screen name="Vacinas" component={VaccineHistoryScreen} />
      <Drawer.Screen name="Cuidadores" component={CaregiverListScreen} />
    </Drawer.Navigator>
  );
}

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeDrawer} />
      <Stack.Screen name="Tratamentos" component={TreatmentListScreen} />
      <Stack.Screen name="Consultas" component={ConsultationListScreen} />
      <Stack.Screen name="Exames" component={ExamListScreen} />
      <Stack.Screen name="Medicamentos" component={MedicationListScreen} />
      <Stack.Screen name="CEM" component={CEMListScreen} />
      <Stack.Screen name="Visualizar Medicamentos CEM" component={ViewCEMMedicationsScreen} />
      <Stack.Screen name="Adicionar Medicamento CEM" component={AddCEMMedicationScreen} />
      <Stack.Screen name="Editar Medicamento CEM" component={EditCEMMedicationScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
