import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/PatientRegisterScreenStyles';
import { authApi } from '../../../api/endpoints/authApi';
import { useAuth } from '../../../auth/useAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PatientRegisterScreen = ({ navigation }) => {
  const { signIn } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (name.trim().length < 3) return 'Informe seu nome completo.';
    if (!EMAIL_RE.test(email.trim())) return 'Informe um e-mail válido.';
    if (phone.replace(/\D/g, '').length < 10) return 'Informe um telefone válido com DDD.';
    if (password.length < 8) return 'A senha deve ter ao menos 8 caracteres.';
    return '';
  };

  const handleRegister = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setLoading(true);

    const credentials = { email: email.trim(), password };
    try {
      await authApi.register({
        name: name.trim(),
        email: credentials.email,
        number: phone.trim(),
        password,
      });
      // Login automático: a navegação passa a Onboarding (Fase 2) / App.
      const session = await authApi.login(credentials);
      await signIn(session);
    } catch (err) {
      if (err?.status === 409) {
        setError('Já existe uma conta com este e-mail.');
      } else if (err?.status === 400) {
        setError(err.message || 'Dados inválidos. Revise os campos.');
      } else {
        setError(err?.message || 'Não foi possível concluir o cadastro.');
      }
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/mediway-paciente.jpg')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Cadastro de Paciente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone (com DDD)"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 8 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      {error ? (
        <Text style={{ color: '#d32f2f', alignSelf: 'flex-start', marginBottom: 10 }}>
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.link}>← Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PatientRegisterScreen;
