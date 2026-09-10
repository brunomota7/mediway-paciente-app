// 📁 src/navigation/OnboardingStack.js
//
// Renderizado quando `status === 'needsOnboarding'` (logado, sem cadastro clínico).

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
