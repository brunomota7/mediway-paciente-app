import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../styles/ForgotPasswordScreenStyles';

const ForgotPasswordScreen = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Validação simples do campo
  const handleSendCode = () => {
    if (input.length < 5) {
      setError('Insira um e-mail ou número válido');
    } else {
      setError('');
      navigation.navigate('ValidateCode'); // navegar para a próxima tela
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>Informe seu e-mail ou número de telefone para receber um código de verificação.</Text>

      <TextInput
        placeholder="Digite seu e-mail ou número"
        value={input}
        onChangeText={setInput}
        style={[styles.input, error ? styles.inputError : null]}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ValidateCode')}>
        <Text style={styles.buttonText}>Enviar Código</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>← Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;