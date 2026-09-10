// 📁 src/features/auth/screens/ChangePasswordScreen.js
//
// Troca de senha do usuário autenticado (L5). A Mediway API não tem endpoint
// dedicado — reaproveitamos o fluxo de redefinição por código (A3 → A4 → A5)
// a partir da área logada, com o `identifier` pré-preenchido pelo e-mail do
// usuário. Ver FASES_INTEGRACAO_API.md §14 (pendência: PUT /auth/change-password).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/ChangePasswordScreenStyles';
import { authApi } from '../../../api/endpoints/authApi';
import { useAuth } from '../../../auth/useAuth';

export default function ChangePasswordScreen({ navigation }) {
  const { user } = useAuth();
  const identifier = user?.email || user?.number || '';

  const [step, setStep] = useState(1); // 1 = enviar código · 2 = validar + nova senha
  const [code, setCode] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const enviarCodigo = async () => {
    if (!identifier) {
      setErro('Não foi possível identificar seu e-mail. Atualize o perfil.');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      await authApi.requestReset({ identifier });
      setStep(2);
    } catch (err) {
      if (err?.isRateLimited) {
        setErro('Muitas solicitações. Aguarde um pouco e tente de novo.');
      } else {
        setErro(err?.message || 'Não foi possível enviar o código.');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmarTroca = async () => {
    if (!/^\d{6}$/.test(code)) {
      setErro('O código deve ter 6 dígitos.');
      return;
    }
    if (novaSenha.length < 8) {
      setErro('A nova senha deve ter ao menos 8 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      const { tokenTemp } = await authApi.validateCode({ code });
      await authApi.resetPassword({ newPassword: novaSenha, resetToken: tokenTemp });
      Alert.alert('Senha alterada', 'Use a nova senha no próximo login.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      if (err?.status === 400 || err?.isNotFound) {
        setErro('Código incorreto ou expirado.');
      } else if (err?.isUnauthorized || err?.isForbidden) {
        setErro('O código expirou. Reenvie e tente de novo.');
      } else {
        setErro(err?.message || 'Não foi possível alterar a senha.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="lock-reset" size={40} color="#4caf50" />
        <Text style={styles.title}>Trocar Senha</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {step === 1 ? (
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Enviaremos um código de verificação para {identifier || 'seu contato'}.
          </Text>
          {erro !== '' && <Text style={styles.error}>{erro}</Text>}
          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={enviarCodigo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="email-fast" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>  Enviar código</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Código recebido</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
          />

          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={!mostrarSenha}
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={!mostrarSenha}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.toggleButton}
          >
            <MaterialCommunityIcons
              name={mostrarSenha ? 'eye-off' : 'eye'}
              size={20}
              color="#4caf50"
            />
            <Text style={styles.toggleText}>
              {mostrarSenha ? ' Ocultar senhas' : ' Mostrar senhas'}
            </Text>
          </TouchableOpacity>

          {erro !== '' && <Text style={styles.error}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={confirmarTroca}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>  Salvar Nova Senha</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.exitButton} onPress={enviarCodigo} disabled={loading}>
            <MaterialCommunityIcons name="refresh" size={20} color="#388e3c" />
            <Text style={styles.exitButtonText}>  Reenviar código</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>  Sair da Tela</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
