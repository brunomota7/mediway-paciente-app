// 📁 src/features/auth/screens/ChangePasswordScreen.js
//
// Troca de senha do usuário LOGADO — PUT /auth/change-password (senha atual +
// nova). Não usa mais e-mail/código (fluxo antigo A3→A4→A5, mantido só em
// "Esqueci a senha" no login). 422 = senha atual incorreta.

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

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    if (!currentPassword || !novaSenha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
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
      await authApi.changePassword({ currentPassword, newPassword: novaSenha });
      Alert.alert('Senha alterada', 'Sua senha foi atualizada com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      if (err?.status === 422) setErro('Senha atual incorreta.');
      else if (err?.status === 400) setErro(err.message || 'Nova senha inválida (mínimo 8 caracteres).');
      else setErro(err?.message || 'Não foi possível alterar a senha.');
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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Senha atual</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          editable={!loading}
        />

        <Text style={styles.label}>Nova senha (mín. 8 caracteres)</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={novaSenha}
          onChangeText={setNovaSenha}
          editable={!loading}
        />

        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          editable={!loading}
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
          onPress={salvar}
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
      </View>

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>  Sair da Tela</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
