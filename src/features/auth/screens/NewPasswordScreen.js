import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/NewPasswordScreenStyles';
import { authApi } from '../../../api/endpoints/authApi';

/**
 * Última etapa do fluxo "esqueci a senha": define a nova senha usando o
 * tokenTemp (SCOPE_RESET) recebido de `ValidateCodeScreen` via params.
 */
const NewPasswordScreen = ({ navigation, route }) => {
  const resetToken = route?.params?.resetToken ?? null;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const backToLogin = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  const handleSubmit = async () => {
    if (!resetToken) {
      setError('Sessão de redefinição expirada. Recomece o processo.');
      return;
    }
    if (password.length < 8) {
      setError('A nova senha deve ter ao menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ newPassword: password, resetToken });
      Alert.alert('Senha redefinida', 'Use a nova senha para entrar.', [
        { text: 'OK', onPress: backToLogin },
      ]);
    } catch (err) {
      if (err?.isUnauthorized || err?.isForbidden) {
        setError('O código expirou. Recomece o processo de redefinição.');
      } else {
        setError(err?.message || 'Não foi possível redefinir a senha.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Senha</Text>
      <Text style={styles.subtitle}>Defina a senha que você vai usar para entrar.</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Nova senha"
          secureTextEntry={!show}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShow(!show)}>
          <MaterialCommunityIcons
            name={show ? 'eye' : 'eye-off'}
            size={22}
            color="#2e7d32"
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="Confirmar nova senha"
        secureTextEntry={!show}
        value={confirm}
        onChangeText={setConfirm}
        editable={!loading}
      />

      <Text style={styles.hint}>Mínimo de 8 caracteres.</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar nova senha</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={backToLogin} disabled={loading}>
        <Text style={styles.link}>← Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPasswordScreen;
