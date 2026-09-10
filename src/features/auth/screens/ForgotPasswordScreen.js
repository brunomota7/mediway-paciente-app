import { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/ForgotPasswordScreenStyles';
import { authApi } from '../../../api/endpoints/authApi';

const ForgotPasswordScreen = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    const identifier = input.trim();
    if (identifier.length < 5) {
      setError('Insira um e-mail ou número válido.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.requestReset({ identifier });
      navigation.navigate('ValidateCode', { identifier });
    } catch (err) {
      if (err?.isRateLimited) {
        setError('Muitas tentativas. Aguarde um pouco antes de pedir um novo código.');
      } else if (err?.isNetwork || err?.isTimeout) {
        setError(err.message);
      } else {
        setError(err?.message || 'Não foi possível enviar o código.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Informe seu e-mail ou número de telefone para receber um código de
        verificação.
      </Text>

      <TextInput
        placeholder="Digite seu e-mail ou número"
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
        style={[styles.input, error ? styles.inputError : null]}
        editable={!loading}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSendCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar Código</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.link}>← Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
