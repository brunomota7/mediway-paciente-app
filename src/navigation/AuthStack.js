// 📁 src/navigation/AuthStack.js
//
// Fluxo público, renderizado quando `status === 'signedOut'`.
// A tela "NovaSenha" (definir senha após validar o código) entra na Fase 1.

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../features/auth/screens/SplashScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import ForgotPasswordScreen from '../features/auth/screens/ForgotPasswordScreen';
import ValidateCodeScreen from '../features/auth/screens/ValidateCodeScreen';
import PatientRegisterScreen from '../features/auth/screens/PatientRegisterScreen';
import GoogleRegisterScreen from '../features/auth/screens/GoogleRegisterScreen';
import FacebookRegisterScreen from '../features/auth/screens/FacebookRegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ValidateCode" component={ValidateCodeScreen} />
      <Stack.Screen name="Register" component={PatientRegisterScreen} />
      {/* TODO Fase 1 (L10): remover login social — sem suporte no backend. */}
      <Stack.Screen name="GoogleRegister" component={GoogleRegisterScreen} />
      <Stack.Screen name="FacebookRegister" component={FacebookRegisterScreen} />
    </Stack.Navigator>
  );
}
