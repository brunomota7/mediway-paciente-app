import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import styles from '../styles/SplashScreenStyles';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animação e navegação automática após 3 segundos
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../../assets/mediway-paciente.jpg')}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      <Text style={styles.title}>MEDIWAY</Text>
      <Text style={styles.slogan}>Facilite o cuidado, fortaleça o amor 💙</Text>
    </View>
  );
};

export default SplashScreen;