// 📁 src/navigation/RootNavigator.js
//
// Escolhe qual navigator montar a partir do `status` da sessão.
// Trocar de stack aqui zera a pilha de navegação — é o que garante que o
// logout leve de volta ao Login e o login entre direto na Home.

import { useAuth } from '../auth/useAuth';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import OnboardingStack from './OnboardingStack';
import LoadingScreen from './LoadingScreen';

export default function RootNavigator() {
  const { status } = useAuth();

  switch (status) {
    case 'loading':
      return <LoadingScreen />;
    case 'signedIn':
      return <AppStack />;
    case 'needsOnboarding':
      return <OnboardingStack />;
    case 'signedOut':
    default:
      return <AuthStack />;
  }
}
