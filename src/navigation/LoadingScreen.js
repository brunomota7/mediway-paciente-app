// 📁 src/navigation/LoadingScreen.js
//
// Exibido enquanto o AuthContext lê a sessão do SecureStore (status 'loading').
// Não depende de navegação — pode ser renderizado fora de qualquer navigator.

import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/mediway-paciente.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#2e7d32" style={styles.spinner} />
      <Text style={styles.text}>Carregando…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  logo: { width: 180, height: 90, marginBottom: 24 },
  spinner: { marginBottom: 12 },
  text: { color: '#555', fontSize: 14 },
});
