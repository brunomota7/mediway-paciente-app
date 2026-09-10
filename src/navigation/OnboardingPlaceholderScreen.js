// 📁 src/navigation/OnboardingPlaceholderScreen.js
//
// Espaço reservado do onboarding clínico (POST /patients/add-infos).
// Será substituído por uma tela real na Fase 2. Hoje o status
// 'needsOnboarding' ainda não é produzido (o bootstrap não chama /patients/me),
// então esta tela não aparece em execução normal — existe só para o
// OnboardingStack ficar completo.

import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/useAuth';

export default function OnboardingPlaceholderScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete seu cadastro</Text>
      <Text style={styles.body}>
        Etapa de dados clínicos do paciente. Implementação na Fase 2
        (POST /patients/add-infos).
      </Text>
      <Text style={styles.link} onPress={signOut}>
        Sair
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#2e7d32', marginBottom: 8 },
  body: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 24 },
  link: { fontSize: 14, color: '#2e7d32', textDecorationLine: 'underline' },
});
