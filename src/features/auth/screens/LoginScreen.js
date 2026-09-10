import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/LoginScreenStyles';
import { authApi } from '../../../api/endpoints/authApi';
import { useAuth } from '../../../auth/useAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter ao menos 8 caracteres.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await authApi.login({ email: email.trim(), password });
      // A troca de stack (AuthStack -> App/Onboarding) é automática via RootNavigator.
      await signIn(data);
    } catch (err) {
      if (err?.isUnauthorized) {
        setError('E-mail ou senha incorretos.');
      } else if (err?.isNetwork || err?.isTimeout) {
        setError(err.message);
      } else {
        setError(err?.message || 'Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require('../../../../assets/mediway-paciente.jpg')}
          style={styles.logo}
        />
        <Text style={styles.slogan}>Facilite o cuidado, fortaleça o amor</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconBtn}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#2e7d32"
              />
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          disabled={loading}
        >
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        >
          <Text style={styles.link}>Cadastrar novo paciente</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Caso tenha conta Mediway como cuidador ou equipe multidisciplinar não
          precisa criar outra conta.
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
