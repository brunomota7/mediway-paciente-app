// 📁 src/features/consultations/screens/ConsultationListScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ConsultationTabs from '../components/ConsultationTabs';
import styles from '../styles/ConsultationListScreenStyles';

import AddConsultationModal from './AddConsultationModal';
import EditConsultationModal from './EditConsultationModal';

/**
 * Tela de listagem de Consultas do Paciente
 * Segue padrão MVVM, responsivo, com identidade visual Mediway
 */
export default function ConsultationListScreen({ navigation }) {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // ✅ controle do modal de edição
  const [consultaSelecionada, setConsultaSelecionada] = useState(null); // ✅ consulta em edição
  
  // Simulação de dados (substitua futuramente por endpoint da API)
  // Lista de consultas
  const [consultas, setConsultas] = useState([
    {
      Id18: 1,
      Nome: 'Consulta com Cardiologista',
      DataRequisicao: '2025-07-15T08:00:00',
      DataConsulta: '2025-07-20T14:00:00',
      Local: 'Clínica Coração',
      Requisito: 'Jejum de 8 horas',
      Status: 0,
      fkId16: 'Dr. João Silva',
    },
    {
      Id18: 2,
      Nome: 'Consulta com Nutricionista',
      DataRequisicao: '2025-06-10T08:00:00',
      DataConsulta: '2025-06-15T14:00:00',
      Local: 'Centro Saúde',
      Requisito: '',
      Status: 1,
      fkId16: 'Dra. Camila Santos',
    },
    {
      Id18: 3,
      Nome: 'Consulta com Dermatologista',
      DataRequisicao: '2025-07-01T09:30:00',
      DataConsulta: '2025-07-05T10:00:00',
      Local: 'Clínica Pele Saudável',
      Requisito: 'Evitar uso de cremes no dia anterior',
      Status: 2,
      fkId16: 'Dr. Ricardo Lima',
    },
    {
      Id18: 4,
      Nome: 'Consulta com Ortopedista',
      DataRequisicao: '2025-07-10T11:00:00',
      DataConsulta: '2025-07-18T15:30:00',
      Local: 'Hospital dos Ossos',
      Requisito: 'Levar exames anteriores',
      Status: 3,
      fkId16: 'Dra. Fernanda Costa',
    },
    {
      Id18: 5,
      Nome: 'Consulta com Oftalmologista',
      DataRequisicao: '2025-06-20T08:45:00',
      DataConsulta: '2025-06-25T09:00:00',
      Local: 'Visão Total',
      Requisito: 'Não usar lentes de contato no dia',
      Status: 0,
      fkId16: 'Dr. Paulo Mendes',
    },
    {
      Id18: 6,
      Nome: 'Consulta com Endocrinologista',
      DataRequisicao: '2025-07-12T10:15:00',
      DataConsulta: '2025-07-19T13:00:00',
      Local: 'Clínica Metabolismo',
      Requisito: 'Jejum de 12 horas',
      Status: 1,
      fkId16: 'Dra. Juliana Ribeiro',
    }
  ]);

  // Adicionar nova consulta
  const handleSalvarConsulta = (novaConsulta) => {
    const novaComId = {
      ...novaConsulta,
      Id18: Date.now(),
    };

    setConsultas((prev) =>
      [...prev, novaComId].sort((a, b) => new Date(b.DataConsulta) - new Date(a.DataConsulta))
    );
    setModalVisible(false);
  };

  // Atualizar consulta existente
  const handleAtualizarConsulta = (consultaAtualizada) => {
    const atualizadas = consultas.map((c) =>
      c.Id18 === consultaAtualizada.Id18 ? consultaAtualizada : c
    );
    setConsultas(atualizadas);
    setEditModalVisible(false);
    setConsultaSelecionada(null);
  };

  // Ao clicar no lápis (ícone de edição)
  const handleEditar = (consulta) => {
    setConsultaSelecionada(consulta);
    setEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Título e Identificação */}
      <Text style={styles.title}>Consultas</Text>
      <Text style={styles.subtitle}>Edilson Carlos Silva Lima</Text>

      {/* 🔹 Passar os dados de consultas para o componente */}
      <ConsultationTabs 
        consultas={consultas} 
        onEdit={handleEditar} // ✅ passar função de edição 
      />

      {/* 🔹 Botões Inferiores */}
      {/* 🔹 Botão de Adicionar Nova Consulta */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="calendar-plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar Nova Consulta</Text>
      </TouchableOpacity>

      {/* 🔹 Botão de Voltar */}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>Sair</Text>
      </TouchableOpacity>

      {/* 🔹 Modal: Adicionar */}
      <AddConsultationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSalvarConsulta}
      />

      {/* 🔹 Modal: Editar */}
      {consultaSelecionada && (
        <EditConsultationModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setConsultaSelecionada(null);
          }}
          onSave={handleAtualizarConsulta}
          consulta={consultaSelecionada}
        />
      )}
    </View>
  );
}
