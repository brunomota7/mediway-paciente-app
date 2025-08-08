import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/GoogleRegisterScreenStyles';

const GoogleRegisterScreen = ({ navigation }) => {
  const handleGoogleAuth = () => {
    // Simula integração com Google
    console.log('Autenticando com Google...');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/mediway-paciente.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Conecte-se com sua conta Google para começar a usar o Mediway.</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth}>
        <Image
          source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continuar com Google</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Ou crie uma conta manualmente</Text>
        <View style={styles.separatorLine} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Cadastrar novo paciente</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>← Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleRegisterScreen;