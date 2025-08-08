import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../styles/ValidateCodeScreenStyles';

const ValidateCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(120); // 2 minutos

  // Validação simples
  const handleValidate = () => {
    if (code.length !== 6) {
      setError('Código incorreto. Verifique e tente novamente.');
    } else {
      setError('');
      // continuar fluxo
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifique o Código</Text>
      <Text style={styles.subtitle}>Digite o código de 6 dígitos que foi enviado para seu e-mail ou número de telefone.</Text>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={code}
        onChangeText={setCode}
        maxLength={6}
        keyboardType="numeric"
        placeholder="000000"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.timerText}>Código expira em: {Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)}</Text>

      <TouchableOpacity disabled={countdown > 0}>
        <Text style={[styles.resend, countdown > 0 && styles.disabledResend]}>Reenviar Código</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleValidate}>
        <Text style={styles.buttonText}>Validar e Continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>← Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ValidateCodeScreen;