import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/ValidateCodeScreenStyles';
import { authApi } from '../../../api/endpoints/authApi';

const RESEND_SECONDS = 60; // rate limit do backend: 5/min por IP

const ValidateCodeScreen = ({ navigation, route }) => {
  const identifier = route?.params?.identifier ?? null;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleValidate = async () => {
    if (!/^\d{6}$/.test(code)) {
      setError('O código deve ter exatamente 6 dígitos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { tokenTemp } = await authApi.validateCode({ code });
      // tokenTemp (SCOPE_RESET) trafega apenas via params — nunca é persistido.
      navigation.navigate('NewPassword', { resetToken: tokenTemp });
    } catch (err) {
      if (err?.status === 400 || err?.isNotFound) {
        setError('Código incorreto ou expirado. Verifique e tente novamente.');
      } else if (err?.isRateLimited) {
        setError('Muitas tentativas. Aguarde um pouco e tente de novo.');
      } else {
        setError(err?.message || 'Não foi possível validar o código.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    if (!identifier) {
      setError('Volte e informe novamente o e-mail ou telefone.');
      return;
    }
    setResending(true);
    setError('');
    try {
      await authApi.requestReset({ identifier });
      setCountdown(RESEND_SECONDS);
    } catch (err) {
      if (err?.isRateLimited) {
        setError('Limite de reenvios atingido. Aguarde alguns minutos.');
      } else {
        setError(err?.message || 'Não foi possível reenviar o código.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifique o Código</Text>
      <Text style={styles.subtitle}>
        Digite o código de 6 dígitos que foi enviado para seu e-mail ou número de
        telefone.
      </Text>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
        maxLength={6}
        keyboardType="number-pad"
        placeholder="000000"
        editable={!loading}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.timerText}>
        {countdown > 0
          ? `Você pode reenviar em: 0:${String(countdown).padStart(2, '0')}`
          : 'Já é possível reenviar o código.'}
      </Text>

      <TouchableOpacity disabled={countdown > 0 || resending} onPress={handleResend}>
        <Text style={[styles.resend, (countdown > 0 || resending) && styles.disabledResend]}>
          {resending ? 'Reenviando…' : 'Reenviar Código'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleValidate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Validar e Continuar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.link}>← Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ValidateCodeScreen;
