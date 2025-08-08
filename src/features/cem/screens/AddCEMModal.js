// 📁 src/features/cem/screens/AddCEMModal.js
 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/AddCEMModalStyles';

/**
 * Tela para adicionar nova CEM ao paciente logado.
 * Padrão MVVM | Design clean e funcional.
 */
export default function AddCEMModal({ visible, onClose, onAdd }) {

  // Simulação de CEMs detectadas via rede (futuramente via API)
  const [cemDetectadas, setCemDetectadas] = useState([
    { serie: 'CEM-903A1D72' },
    { serie: 'CEM-774BC89F' },
    { serie: 'CEM-12FA782C' },
    { serie: 'CEM-88DD220A' },
  ]);

  const paciente = 'Edilson Carlos Silva Lima'; // Simulação de paciente logado

  const handleAdicionarCEM = (serie) => {
    // Aqui você poderia fazer uma requisição para vincular a CEM ao paciente
    const sucesso = true; // simulação de resposta

    <TouchableOpacity style={styles.backButton} onPress={onClose}>
      <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
      <Text style={styles.backButtonText}>Voltar à Lista da CEM</Text>
    </TouchableOpacity>
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔹 Cabeçalho */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="package-variant-closed" size={24} color="#4caf50" />
          <Text style={styles.title}>Caixa Eletrônica de Medicamento (CEM)</Text>
        </View>
        <Text style={styles.subtitle}>{paciente}</Text>

        {/* 🔹 Título da Seção */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="wifi" size={20} color="#4caf50" />
          <Text style={styles.sectionTitle}>CEM disponíveis</Text>
        </View>

        {/* 🔹 Lista de CEMs */}
        {cemDetectadas.map((cem, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.serieText}>{cem.serie}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAdicionarCEM(cem.serie)}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* 🔹 Botão Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.backButtonText}>Voltar à Lista da CEM</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}
