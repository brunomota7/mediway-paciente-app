// 📁 src/features/medications/screens/MedicationListScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TabView } from '@rneui/themed';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MedicationTabs from '../components/MedicationTabs';
import styles from '../styles/MedicationListScreenStyles';
import AddMedicationModal from './AddMedicationModal';
import EditMedicationModal from './EditMedicationModal';

/**
 * Tela de listagem de medicamentos do paciente
 * Segue padrão MVVM, com visual Mediway
 */
export default function MedicationListScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const [medications, setMedications] = useState([
    {
      Id11: 1,
      Nome: 'Dipirona',
      Tipo: 'Genérico',
      NomeReferencia: 'Anador',
      Descricao: 'Analgésico e antitérmico',
      Concentração: '500mg',
      Quantidade: '1 comprimido',
      Dia: 'Segunda, Quarta, Sexta',
      Hora: '08:00',
      Gaveta: 'A1',
      Estoque: 10,
      Situacao: 0,
    },
    {
      Id11: 2,
      Nome: 'Omeprazol',
      Tipo: 'Referência',
      NomeReferencia: 'Losec',
      Descricao: 'Redução da acidez estomacal',
      Concentração: '20mg',
      Quantidade: '1 cápsula',
      Dia: 'Todos os dias',
      Hora: 'Antes do café',
      Gaveta: 'B2',
      Estoque: 5,
      Situacao: 1,
      DataSuspensao: '2025-06-30',
    },
    {
      Id11: 3,
      Nome: 'Paracetamol',
      Tipo: 'Genérico',
      NomeReferencia: 'Tylenol',
      Descricao: 'Analgésico e antitérmico',
      Concentração: '750mg',
      Quantidade: '1 comprimido',
      Dia: 'Terça e Quinta',
      Hora: '09:00',
      Gaveta: 'A2',
      Estoque: 8,
      Situacao: 0,
    },
    {
      Id11: 4,
      Nome: 'Loratadina',
      Tipo: 'Referência',
      NomeReferencia: 'Claritin',
      Descricao: 'Antialérgico',
      Concentração: '10mg',
      Quantidade: '1 comprimido',
      Dia: 'Todos os dias',
      Hora: '10:00',
      Gaveta: 'C1',
      Estoque: 15,
      Situacao: 0,
    },
    {
      Id11: 5,
      Nome: 'Metformina',
      Tipo: 'Genérico',
      NomeReferencia: 'Glucoformin',
      Descricao: 'Controle de glicemia',
      Concentração: '500mg',
      Quantidade: '1 comprimido',
      Dia: 'Todos os dias',
      Hora: 'Após o almoço',
      Gaveta: 'B1',
      Estoque: 20,
      Situacao: 0,
    },
    {
      Id11: 6,
      Nome: 'Captopril',
      Tipo: 'Genérico',
      NomeReferencia: 'Capoten',
      Descricao: 'Antihipertensivo',
      Concentração: '25mg',
      Quantidade: '1 comprimido',
      Dia: 'Segunda a Sábado',
      Hora: '07:00',
      Gaveta: 'D1',
      Estoque: 12,
      Situacao: 0,
    },
    {
      Id11: 7,
      Nome: 'Amoxicilina',
      Tipo: 'Referência',
      NomeReferencia: 'Amoxil',
      Descricao: 'Antibiótico de largo espectro',
      Concentração: '500mg',
      Quantidade: '1 cápsula',
      Dia: 'Todos os dias',
      Hora: '12:00',
      Gaveta: 'C2',
      Estoque: 6,
      Situacao: 1,
      DataSuspensao: '2025-07-01',
    },
    {
      Id11: 8,
      Nome: 'Ranitidina',
      Tipo: 'Genérico',
      NomeReferencia: 'Antak',
      Descricao: 'Tratamento de refluxo ácido',
      Concentração: '150mg',
      Quantidade: '1 comprimido',
      Dia: 'Terça, Quinta, Sábado',
      Hora: 'Antes de dormir',
      Gaveta: 'E1',
      Estoque: 10,
      Situacao: 2,
      DataSuspensao: '2025-07-01',
    }
  ]);

  // Salvar novo medicamento
  const handleSaveMedication = (novaMed) => {
    const novoMedId = { ...novaMed, Id11: Date.now() };
    setMedications((prev) => [...prev, novoMedId]);
    setModalVisible(false);
  };

  // Atualizar medicamento existente
  const handleEditMedication = (updated) => {
    setMedications((prev) =>
      prev.map((m) => (m.Id11 === updated.Id11 ? updated : m))
    );
    setEditModalVisible(false);
    setSelectedMedication(null);
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.titleView}>
          <MaterialCommunityIcons name="pill" size={24} color="#4caf50" />
          <Text style={styles.title}>Medicamentos</Text>
        </View>
        <Text style={styles.subtitle}>Edilson Carlos Silva Lima</Text>
      </View>

      {/* Abas + Lista (rolável apenas essa parte) */}
      <View style={styles.contentContainer}>
        <MedicationTabs
          medicamentos={medications}
          onEdit={(m) => {
            setSelectedMedication(m);
            setEditModalVisible(true);
          }}
        />
      </View>

      {/* Botões inferiores (fixos) */}
      <View style={styles.areaBtnInferiores}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar Novo Medicamento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Modais */}
      <AddMedicationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveMedication}
      />

      {selectedMedication && (
        <EditMedicationModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedMedication(null);
          }}
          onSave={handleEditMedication}
          medicamento={selectedMedication}
        />
      )}
    </View>

  );
}
