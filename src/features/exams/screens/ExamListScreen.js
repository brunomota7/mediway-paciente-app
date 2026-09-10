// 📁 src/features/exams/screens/ExamListScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ExamTabs from '../components/ExamTabs';
import styles from '../styles/ExamListScreenStyles';
import { useAuth } from '../../../auth/useAuth';

import AddExamModal from './AddExamModal';
import EditExamModal from './EditExamModal';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Tela principal de Exames do paciente
 * MVVM | Visual Mediway
 */
export default function ExamListScreen({ navigation }) {
    const { user } = useAuth();
    const patientName = user?.name || 'Paciente';

    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // ✅ controle do modal de edição
    const [exameSelecionado, setExameSelecionado] = useState(null); // ✅ exame em edição

  // Simulação de dados (substitua por dados reais via API futuramente)
  // Lista de exames
  const [exames, setExames] = useState([
    {
      Id19: 1,
      Nome: 'Hemograma Completo',
      fkId18: 'Dr. Simulado 1',
      DataSolicitacao: '2025-07-10T08:00:00',
      DataExameData: '2025-07-15',
      DataExameHora: '08:00',
      Local: 'Laboratório Central',
      Requisito: 'Jejum de 12 horas',
      fkId16: '',
      Situacao: 2,
      DataExame: '2025-07-15T08:00:00',
      DataCancelamento: null,
    },
    {
      Id19: 2,
      Nome: 'Ultrassom Abdômen',
      fkId18: 'Dra. Simulada 2',
      DataSolicitacao: '2025-07-05T09:00:00',
      DataExameData: '2025-07-10',
      DataExameHora: '10:00',
      Local: 'Centro Diagnóstico',
      Requisito: '',
      fkId16: 'Maria do Socorro',
      Situacao: 0,
      DataExame: '2025-07-10T10:00:00',
      DataCancelamento: null,
    },
    {
        Id19: 3,
        Nome: 'Raio-X Torácico',
        fkId18: 'Dr. Radiologista 3',
        DataSolicitacao: '2025-07-12T11:30:00',
        DataExameData: '2025-07-17',
        DataExameHora: '14:00',
        Local: 'Clínica São Marcos',
        Requisito: 'Evitar uso de metais',
        fkId16: 'João Oliveira',
        Situacao: 0,
        DataExame: '2025-07-17T14:00:00',
        DataCancelamento: null,
    },
    {
        Id19: 4,
        Nome: 'Eletrocardiograma',
        fkId18: 'Dra. Cardiologista 4',
        DataSolicitacao: '2025-07-15T10:45:00',
        DataExameData: '2025-07-18',
        DataExameHora: '09:30',
        Local: 'Hospital Coração do Maranhão',
        Requisito: '',
        fkId16: 'Carlos Mendes',
        Situacao: 1,
        DataExame: '2025-07-18T09:30:00',
        DataCancelamento: null,
    },
    {
        Id19: 5,
        Nome: 'Teste de Glicemia',
        fkId18: 'Dr. Endócrino 5',
        DataSolicitacao: '2025-07-18T07:15:00',
        DataExameData: '2025-07-20',
        DataExameHora: '07:45',
        Local: 'Laboratório Vida Saudável',
        Requisito: 'Jejum de 8 horas',
        fkId16: '',
        Situacao: 3,
        DataExame: '2025-07-20T07:45:00',
        DataCancelamento: null,
    },
    {
        Id19: 6,
        Nome: 'Tomografia Craniana',
        fkId18: 'Dra. Neurologista 6',
        DataSolicitacao: '2025-07-14T13:00:00',
        DataExameData: '2025-07-19',
        DataExameHora: '13:30',
        Local: 'Centro de Imagem Maranhão',
        Requisito: 'Informar uso de medicamentos',
        fkId16: 'Ana Paula Lima',
        Situacao: 2,
        DataExame: '2025-07-19T13:30:00',
        DataCancelamento: null,
    }
  ]);

  // Adicionar novo exame
  const handleSalvarExame = (novoExame) => {
    const novoExaId = {
      ...novoExame,
      Id19: Date.now(),
    };

    setExames((prev) =>
      [...prev, novoExaId].sort((a, b) => new Date(b.DataExame) - new Date(a.DataExame))
    );
    setModalVisible(false);
  };

  // Atualizar exame existente
  const handleAtualizarExame = (exameAtualizado) => {
    const atualizados = exames.map((e) =>
      e.Id19 === exameAtualizado.Id19 ? exameAtualizado : e
    );
    setExamess(atualizados);
    setEditModalVisible(false);
    setExameSelecionado(null);
  };

  // Ao clicar no lápis (ícone de edição)
  const handleEditar = (exame) => {
    setExameSelecionado(exame);
    setEditModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
          {/* Título e Identificação */}
          <Text style={styles.title}>Exames</Text>
          <Text style={styles.subtitle}>{patientName}</Text>

          {/* Abas com lista de exames */}
          <ExamTabs 
              exames={exames} 
              onEdit={handleEditar}     // ✅ passar função de edição
          />

          {/* Botão Adicionar Novo Exame */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar Novo Exame</Text>
          </TouchableOpacity>

          {/* Botão Voltar */}
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
              <Text style={styles.exitButtonText}>Sair</Text>
          </TouchableOpacity>

          {/* 🔹 Modal: Adicionar */}
          <AddExamModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSave={handleSalvarExame}
          />

          {/* 🔹 Modal: Editar */}
          {exameSelecionado && (
              <EditExamModal
                  visible={editModalVisible}
                  onClose={() => {
                      setEditModalVisible(false);
                      setExameSelecionado(null);
                  }}
                  onSave={handleAtualizarExame}
                  consulta={exameSelecionado}
              />
          )}

      </View>
    </SafeAreaView>
  );
}
