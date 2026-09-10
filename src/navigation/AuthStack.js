// 📁 src/navigation/AuthStack.js
//
// Fluxo público, renderizado quando `status === 'signedOut'`.
// Fluxo "esqueci a senha": ForgotPassword -> ValidateCode -> NewPassword -> Login.

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../features/auth/screens/SplashScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import ForgotPasswordScreen from '../features/auth/screens/ForgotPasswordScreen';
import ValidateCodeScreen from '../features/auth/screens/ValidateCodeScreen';
import NewPasswordScreen from '../features/auth/screens/NewPasswordScreen';
import PatientRegisterScreen from '../features/auth/screens/PatientRegisterScreen';

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
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="Register" component={PatientRegisterScreen} />
      {/* Login social (Google/Facebook) removido do fluxo — sem suporte no backend (L10). */}
    </Stack.Navigator>
  );
}
