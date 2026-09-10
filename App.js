// 📁 App.js
//
// Composição raiz do app:
//   SafeAreaProvider
//     QueryClientProvider  -> cache de dados da API (React Query)
//       AuthProvider       -> sessão + bootstrap do token (SecureStore)
//         NavigationContainer
//           RootNavigator  -> escolhe AuthStack / OnboardingStack / AppStack
//
// A navegação por feature vive em src/navigation/*.

import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from './src/api/queryClient';
import { AuthProvider } from './src/auth/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
