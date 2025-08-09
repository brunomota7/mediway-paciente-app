// 📁 src/features/treatments/screens/TreatmentListScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import styles from '../styles/TreatmentListScreenStyles';
import AddTreatmentModal from './AddTreatmentModal';
import EditTreatmentModal from './EditTreatmentModal';

/**
 * Tela de listagem dos tratamentos vinculados ao paciente.
 * Padrão MVVM com separação de estilo e lógica.
 */
export default function TreatmentListScreen({ navigation }) {

  const [modalVisible, setModalVisible] = useState(false);
  const [tratamentos, setTratamentos] = useState([
    {
      id: '1',
      nome: 'Hipertensão Crônica',
      dataInicio: '2023-01-15',
      dataFim: '2023-06-15',
      status: 0,
    },
    {
      id: '2',
      nome: 'Reabilitação Pós-Cirúrgica',
      dataInicio: '2023-05-01',
      dataFim: '2023-08-01',
      status: 1,
    },
    {
      id: '3',
      nome: 'Tratamento para Hipertensão',
      descricao: 'Uso contínuo de medicação para controle da pressão arterial.',
      dataInicio: '2024-01-10',
      dataFim: '2024-06-10',
      status: 0,
    },
    {
      id: '4',
      nome: 'Fisioterapia',
      descricao: 'Sessões para reabilitação do joelho esquerdo.',
      dataInicio: '2024-03-01',
      dataFim: '2024-04-30',
      status: 1,
    },
  ]);

  // 🔄 Adiciona novo tratamento à lista
  const adicionarTratamento = (novo) => {
    const novoComId = { ...novo, id: (tratamentos.length + 1).toString() };
    setTratamentos([...tratamentos, novoComId]);
    setModalVisible(false);
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tratamentoSelecionado, setTratamentoSelecionado] = useState(null);

  const abrirModalEdicao = (tratamento) => {
    setTratamentoSelecionado(tratamento);
    setEditModalVisible(true);
  };

  // 🔁 Renderização dos itens
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🏷️ {item.Nome}</Text>
      <Text style={styles.cardField}>📅 Início: {item.DataInicio}</Text>
      <Text style={styles.cardField}>📅 Término: {item.DataFim}</Text>
      <Text style={[
        styles.cardStatus,
        item.Status === 0 ? styles.statusAtivo : styles.statusInativo
      ]}>
        Situação: {item.Status === 0 ? 'Ativo' : 'Inativo'}
      </Text>
      <TouchableOpacity style={styles.editButton}>
        <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const formatarData = (data) => {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <Text style={styles.title}>Tratamento(s) do Paciente</Text>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔹 Lista de tratamentos */}
        <FlatList
          data={tratamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.treatmentName}>{item.nome}</Text>
                <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
                  <MaterialCommunityIcons name="pencil" size={20} color="#4caf50" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardField}>📅 Início: {formatarData(item.dataInicio)}</Text>
              <Text style={styles.cardField}>📅 Término: {formatarData(item.dataFim)}</Text>
              <Text
                style={[
                  styles.cardField,
                  item.status === 0 ? styles.statusAtivo : styles.statusInativo
                ]}
              >
                Situação: {item.status === 0 ? 'Ativo' : 'Inativo'}
              </Text>
            </View>
          )}
        />
      </ScrollView>

      <View style={styles.areaBtn}>
        {/* ➕ Botão para adicionar tratamento */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar Novo Tratamento</Text>
        </TouchableOpacity>

        {/* 🔙 Botão de voltar */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* 🧾 Modal para adicionar novo tratamento */}
      <AddTreatmentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={adicionarTratamento}
      />

      {/* ✅ Modal de edição de tratamento */}
      <EditTreatmentModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        tratamento={tratamentoSelecionado}
        onSave={(tratamentoEditado) => {
          const atualizados = tratamentos.map((t) =>
            t.id === tratamentoEditado.id ? tratamentoEditado : t
          );
          setTratamentos(atualizados);
          setEditModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}