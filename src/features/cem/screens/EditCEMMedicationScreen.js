// 📁 src/features/cem/screens/EditCEMMedicationScreen.js

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
import styles from '../styles/EditCEMMedicationScreenStyles';

/**
 * Tela de edição do estoque ou exclusão de medicamento da CEM
 * Padrão MVVM | Visualização somente leitura + edição de estoque
 */
export default function EditCEMMedicationScreen({ route, navigation }) {
  const { medicamento } = route.params;
  const {
    pos,
    paciente,
    serie,
    nome,
    tipo,
    referencia,
    generico,
    similar,
    manipulado,
    concentracao,
    quantidadeDose,
    estoque: estoqueInicial,
  } = medicamento;

  const [estoque, setEstoque] = useState(estoqueInicial.toString());

  const getCorPaciente = (id) => {
    return id === 1 ? '#2196f3' : id === 2 ? '#4caf50' : '#ffeb3b';
  };

  const handleSalvar = () => {
    if (!estoque || isNaN(estoque) || parseInt(estoque) <= 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida.');
      return;
    }

    // Simula atualização de estoque e volta com dados atualizados
    navigation.navigate('Visualizar Medicamentos CEM', {
      serie,
      medicamentoAtualizado: {
        pos,
        paciente,
        medicamento: nome,
        estoque: parseInt(estoque),
      },
    });
  };

  const handleExcluir = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir o medicamento da gaveta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Visualizar Medicamentos CEM', {
              serie,
              gavetaExcluida: pos,
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔹 Cabeçalho */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="pill" size={24} color={getCorPaciente(paciente)} />
        <Text style={styles.title}>Estoque / Excluir do Medicamento Paciente</Text>
        <Text style={styles.subtitle}>
          Paciente:
          <Text style={{ fontWeight: 'bold', color: getCorPaciente(paciente) }}>
            {' '}Paciente {paciente}
          </Text>
        </Text>
        <Text style={styles.subtitle}>CEM: {serie} | Gaveta: {pos}</Text>
      </View>

      {/* 🔹 Informações do Medicamento */}
      <Text style={styles.detail}>Nome: {nome}</Text>
      <Text style={styles.detail}>Tipo: {tipo}</Text>
      <Text style={styles.detail}>Referência: {referencia}</Text>
      <Text style={styles.detail}>Genérico: {generico}</Text>
      <Text style={styles.detail}>Similar: {similar}</Text>
      <Text style={styles.detail}>Manipulado: {manipulado}</Text>
      <Text style={styles.detail}>Concentração: {concentracao}</Text>
      <Text style={styles.detail}>Quantidade/Dose: {quantidadeDose}</Text>

      {/* 🔹 Estoque */}
      <Text style={styles.label}>Quantidade a ser colocada na CEM</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ex: 10"
        value={estoque}
        onChangeText={setEstoque}
      />

      {/* 🔹 Botões */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
        <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Salvar Estoque</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
        <MaterialCommunityIcons name="delete" size={20} color="#fff" />
        <Text style={styles.deleteButtonText}>Excluir Medicamento da CEM</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
        <Text style={styles.cancelButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}