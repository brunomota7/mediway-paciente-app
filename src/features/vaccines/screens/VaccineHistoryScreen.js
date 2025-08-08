// src/features/vaccines/screens/VaccineHistoryScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import DeleteVaccineModal from '../screens/DeleteVaccineModal';
import styles from '../styles/VaccineHistoryScreenStyles';

/**
 * Tela para exibir a carteira de vacinas do paciente
 * Segue o padrão MVVM, separando lógica, visual e componentes reutilizáveis
 */
export default function VaccineHistoryScreen() {

  // Chamar a tela de Editar Vacina
  const navigation = useNavigation();

  //excluir Vacina
  const [modalVisible, setModalVisible] = useState(false);
  const [vacinaSelecionada, setVacinaSelecionada] = useState(null);

  // ViewModel: simulação de dados de vacinas aplicadas
  const [vacinas, setVacinas] = useState([
    {
      id: '1',
      nome: 'Hepatite B',
      tipoDose: 'Primeira Dose',
      dataVacinou: '12/02/2023 08:30',
      lote: 'A123',
      dataFabricacao: '01/01/2023',
      proximaDose: '12/03/2023',
    },
    {
      id: '2',
      nome: 'Tétano',
      tipoDose: 'Reforço',
      dataVacinou: '01/06/2023 14:00',
      lote: 'B456',
      dataFabricacao: '10/05/2023',
      proximaDose: '01/06/2028',
    },
    {
      id: '3',
      nome: 'Influenza',
      tipoDose: 'Anual',
      dataVacinou: '15/04/2024 10:00',
      lote: 'C789',
      dataFabricacao: '03/03/2024',
      proximaDose: '15/04/2025',
    },
    {
      id: '4',
      nome: 'Tétano',
      tipoDose: 'Reforço',
      dataVacinou: '01/06/2024 14:00',
      lote: 'B457',
      dataFabricacao: '10/05/2024',
      proximaDose: '01/06/2029',
    },
    {
      id: '5',
      nome: 'Influenza',
      tipoDose: 'Anual',
      dataVacinou: '15/04/2025 10:00',
      lote: 'C790',
      dataFabricacao: '03/03/2025',
      proximaDose: '15/04/2026',
    },
  ]);

  // Função para abrir o modal de confirmação
  const abrirModalExcluir = (vacina) => {
    setVacinaSelecionada(vacina);
    setModalVisible(true);
  };

  // Confirmação e remoção da vacina
  const confirmarExclusao = () => {
    setVacinas((prev) => prev.filter((v) => v.id !== vacinaSelecionada.id));
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="needle" size={28} color="#4caf50" />
        <Text style={styles.title}>Carteira de Vacinas</Text>
      </View>

      {/* Identificação do paciente */}
      <View style={styles.patientInfo}>
        <MaterialCommunityIcons name="account-circle" size={26} color="#4caf50" />
        <View>
          <Text style={styles.patientName}>Edilson Carlos Silva Lima</Text>
          <Text style={styles.patientDetails}>Nascimento: 23/11/1975  |  Idade: 39  |  Sexo: Masculino</Text>
        </View>
      </View>

      {/* Lista de vacinas tomadas */}
      <FlatList
        data={vacinas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="syringe" size={20} color="#2e7d32" />
              <Text style={styles.vaccineName}>{item.nome}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardField}>
                <Text style={styles.fieldLabel}>Tipo de dose:</Text> {item.tipoDose}
              </Text>
              <Text style={styles.cardField}>
                <Text style={styles.fieldLabel}>Data:</Text> {item.dataVacinou}
              </Text>
              <Text style={styles.cardField}>
                <Text style={styles.fieldLabel}>Lote:</Text> {item.lote}
              </Text>
              <Text style={styles.cardField}>
                <Text style={styles.fieldLabel}>Fabricação:</Text> {item.dataFabricacao}
              </Text>
              <Text style={styles.cardField}>
                <Text style={styles.fieldLabel}>Próxima dose:</Text> {item.proximaDose}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('Editar Vacina', { vacina: item })}
              >
                <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => abrirModalExcluir(item)}
              >
                <MaterialCommunityIcons name="delete" size={18} color="#fff" />
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botão para adicionar nova vacina */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Adicionar Vacina')}
      >
        <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
        <Text style={styles.addButtonText}>  Adicionar Nova Vacina</Text>
      </TouchableOpacity>

      {/* Botão para saída */}
      <TouchableOpacity 
        style={styles.exitButton} 
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>  Sair</Text>
      </TouchableOpacity>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteVaccineModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmarExclusao}
        vacina={vacinaSelecionada}
        paciente="Edilson Carlos Silva Lima"
      />
    </ScrollView>
  );
}
