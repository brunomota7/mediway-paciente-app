// 📁 src/features/auth/screens/ChangePasswordScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as bcrypt from 'bcryptjs';
import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/ChangePasswordScreenStyles';

/**
 * Tela modal para alteração de senha com validações e criptografia
 * Segue padrão MVVM, com separação de estilos e lógica
 */
export default function ChangePasswordScreen({ navigation }) {
  // 🧠 ViewModel: estados internos controlados
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  // 🔒 Validação de senha atual simulada (substituir por chamada real ao backend)
  const senhaAtualCorreta = 'senha123'; // Simulado

  const validarSenha = () => {
    if (senhaAtual !== senhaAtualCorreta) {
      setErro('Senha atual incorreta');
      return false;
    }
    if (novaSenha.length < 8 || !/[A-Z]/.test(novaSenha) || !/[0-9!@#$%^&*]/.test(novaSenha)) {
      setErro('Nova senha precisa ter 8+ caracteres, 1 letra maiúscula e 1 número ou símbolo');
      return false;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return false;
    }
    setErro('');
    return true;
  };

  const handleTrocarSenha = async () => {
    if (!validarSenha()) return;

    // 🔐 Criptografar com bcryptjs
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    console.log('Nova senha criptografada:', hashedPassword);

    // Aqui enviaria para o backend salvar na tabela mw01usuario.Senha
    alert('Senha alterada com sucesso!');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔒 Cabeçalho */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="lock-reset" size={40} color="#4caf50" />
        <Text style={styles.title}>Trocar Senha</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 🔐 Formulário */}
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

      {/* 💾 Botões */}
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
