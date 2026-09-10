// 📁 src/features/cem/screens/ViewCEMMedicationsScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/ViewCEMMedicationsStyles';
import { useAuth } from '../../../auth/useAuth';

/**
 * Tela de visualização de medicamentos armazenados nas gavetas de uma CEM
 * Visual clínico com matriz 3x3 e destaque para o paciente logado
 */
export default function ViewCEMMedicationsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { serie, novoMedicamento = null,
    medicamentoAtualizado = null,
    gavetaExcluida = null } = route.params || {};

  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';
  const pacienteLogado = 2; // TODO Fase 4: derivar da caixa real (GET /medicine-box/me)

  // Simulação da matriz de gavetas (3x3) com medicamentos e pacientes
  const [gavetas, setGavetas] = useState([
    { pos: 'A1', ocupado: true, paciente: 1, medicamento: 'Dipirona' },
    { pos: 'A2', ocupado: false },
    { pos: 'A3', ocupado: true, paciente: 2, medicamento: 'Paracetamol' },
    { pos: 'B1', ocupado: false },
    { pos: 'B2', ocupado: true, paciente: 3, medicamento: 'Losartana' },
    { pos: 'B3', ocupado: true, paciente: 2, medicamento: 'Omeprazol' },
    { pos: 'C1', ocupado: false },
    { pos: 'C2', ocupado: false },
    { pos: 'C3', ocupado: true, paciente: 1, medicamento: 'Metformina' },
  ]);

  // Novo medicamento adicionado
  useEffect(() => {
    if (route.params?.novoMedicamento) {
      const atualizada = gavetas.map((g) =>
        g.pos === route.params.novoMedicamento.pos
          ? {
            ...g,
            ocupado: true,
            paciente: route.params.novoMedicamento.paciente,
            medicamento: route.params.novoMedicamento.medicamento,
          }
          : g
      );
      setGavetas(atualizada);

      // Limpa o param para evitar reexecução no re-render
      navigation.setParams({ novoMedicamento: null });
    }
  }, [route.params?.novoMedicamento]);

  // 🔄 Atualiza estoque do medicamento
  useEffect(() => {
    if (medicamentoAtualizado) {
      const atualizada = gavetas.map((g) =>
        g.pos === medicamentoAtualizado.pos
          ? {
            ...g,
            ocupado: true,
            paciente: medicamentoAtualizado.paciente,
            medicamento: medicamentoAtualizado.medicamento,
          }
          : g
      );
      setGavetas(atualizada);
      navigation.setParams({ medicamentoAtualizado: null });
    }
  }, [medicamentoAtualizado]);

  // 🔄 Remove medicamento e libera gaveta
  useEffect(() => {
    if (gavetaExcluida) {
      const atualizada = gavetas.map((g) =>
        g.pos === gavetaExcluida ? { pos: g.pos, ocupado: false } : g
      );
      setGavetas(atualizada);
      navigation.setParams({ gavetaExcluida: null });
    }
  }, [gavetaExcluida]);

  const getCorPaciente = (paciente) => {
    switch (paciente) {
      case 1: return '#2196f3'; // azul
      case 2: return '#4caf50'; // verde
      case 3: return '#ffeb3b'; // amarelo
      default: return '#e0e0e0';
    }
  };

  const handleGavetaPress = (item) => {
    if (!item.ocupado) {
      navigation.navigate('Adicionar Medicamento CEM', {
        posicao: item.pos,
        paciente: pacienteLogado,
        serie,
      });
    } else if (item.paciente === pacienteLogado) {
      navigation.navigate('Editar Medicamento CEM', {
        medicamento: {
          pos: item.pos,
          paciente: item.paciente,
          serie,
          nome: item.medicamento,
          tipo: 'Genérico',
          referencia: 'Referência XYZ',
          generico: 'Genérico ABC',
          similar: 'Similar DEF',
          manipulado: 'Manipulado GHI',
          concentracao: '500mg',
          quantidadeDose: '1 comprimido',
          estoque: 10,
        },
      });
    }
  };

  const renderCell = (item, index) => (
    <TouchableOpacity key={index} style={styles.cell} onPress={() => handleGavetaPress(item)}>
      <MaterialCommunityIcons
        name="pill"
        size={30}
        color={item.ocupado ? getCorPaciente(item.paciente) : '#ccc'}
      />
      <Text style={styles.cellLabel}>{item.pos}</Text>
      {item.ocupado && <Text style={styles.medName}>{item.medicamento}</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔹 Cabeçalho */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="radio-tower" size={28} color="#4caf50" />
          <Text style={styles.title}>Medicamentos da CEM</Text>
          <Text style={styles.subtitle}>Série: {serie}</Text>
        </View>

        {/* 🔹 Lista de Pacientes (um abaixo do outro) */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <MaterialCommunityIcons name="pill" size={20} color="#2196f3" />
            <Text style={styles.legendText}>Paciente 1: João da Silva</Text>
          </View>
          <View style={styles.legendItem}>
            <MaterialCommunityIcons name="pill" size={20} color="#4caf50" />
            <Text style={styles.legendText}>Paciente 2: {patientName} (você)</Text>
          </View>
          <View style={styles.legendItem}>
            <MaterialCommunityIcons name="pill" size={20} color="#ffeb3b" />
            <Text style={styles.legendText}>Paciente 3: Maria Oliveira</Text>
          </View>
        </View>

        {/* 🔹 Matriz 3x3 (3 medicamentos por linha) */}
        <View style={styles.grid}>
          {gavetas.map((item, index) => renderCell(item, index))}
        </View>

        {/* 🔹 Legenda */}
        <View style={styles.explanation}>
          <Text style={styles.explanationText}>Legenda:</Text>
          <Text style={styles.explanationText}>🟢 Medicamento do Paciente 2</Text>
          <Text style={styles.explanationText}>🟡 Medicamento do Paciente 3</Text>
          <Text style={styles.explanationText}>⚪ Gaveta disponível</Text>
        </View>

        {/* 🔙 Botão para voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.backButtonText}>Voltar à Lista de CEMs</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
