// 📁 src/features/auth/screens/ChangePasswordScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/ChangePasswordScreenStyles';

/**
 * Troca de senha do usuário autenticado.
 *
 * A Mediway API ainda NÃO tem um endpoint de "trocar senha logado" — só a
 * redefinição por código (request-reset -> validate-code -> reset-password).
 * A ligação real com esse fluxo entra na Fase 6 (L5). Por ora, a tela valida
 * o formato da nova senha e orienta o usuário a usar "Esqueci a senha".
 */
export default function ChangePasswordScreen({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  const validar = () => {
    if (!senhaAtual) {
      setErro('Informe a senha atual.');
      return false;
    }
    if (novaSenha.length < 8) {
      setErro('A nova senha deve ter ao menos 8 caracteres.');
      return false;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return false;
    }
    setErro('');
    return true;
  };

  const handleTrocarSenha = () => {
    if (!validar()) return;
    Alert.alert(
      'Em breve',
      'A troca de senha autenticada será habilitada na Fase 6. Enquanto isso, use "Esqueci a senha" na tela de login.',
      [{ text: 'Entendi', onPress: () => navigation.goBack() }],
    );
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
        <Text style={styles.label}>Senha Atual</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={senhaAtual}
          onChangeText={setSenhaAtual}
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
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleTrocarSenha}>
        <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>  Salvar Nova Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>  Sair da Tela</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
