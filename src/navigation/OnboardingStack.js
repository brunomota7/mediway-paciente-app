// 📁 src/navigation/OnboardingStack.js
//
// Renderizado quando `status === 'needsOnboarding'` (a partir da Fase 2).

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingPlaceholderScreen from './OnboardingPlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingPlaceholderScreen} />
    </Stack.Navigator>
  );
}
