import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/FacebookRegisterScreenStyles';

const FacebookRegisterScreen = ({ navigation }) => {
  const handleFacebookAuth = () => {
    // Simula integração com Facebook
    console.log('Autenticando com Facebook...');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/mediway-paciente.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Conecte-se com sua conta do Facebook para começar a usar o Mediway.</Text>

      <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookAuth}>
        <Image
          source={{ uri: 'https://img.icons8.com/color/48/000000/facebook-new.png' }}
          style={styles.facebookIcon}
        />
        <Text style={styles.facebookButtonText}>Continuar com Facebook</Text>
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

export default FacebookRegisterScreen;