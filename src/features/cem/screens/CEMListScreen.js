// 📁 src/features/cem/screens/CEMListScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/CEMListScreenStyles';
import AddCEMModal from './AddCEMModal';

/**
 * Tela para listar e gerenciar CEMs (Caixas Eletrônicas de Medicamentos) associadas ao paciente
 * Padrão MVVM, visual Mediway
 */
export default function CEMListScreen({ navigation }) {

  const [modalVisible, setModalVisible] = useState(false);

  // Lista simulada de CEMs associadas
  const [cemList, setCemList] = useState([
    { Serie: 'CEM-903A1D72', pacientes: 2 },
    { Serie: 'CEM-842B9Z13', pacientes: 1 },
    { Serie: 'CEM-913A1D72', pacientes: 3 },
    { Serie: 'CEM-923A1D72', pacientes: 3 },
    { Serie: 'CEM-501X2K11', pacientes: 2 },
    { Serie: 'CEM-852B9Z13', pacientes: 1 },
  ]);

  // Simulação de séries detectadas via rede
  const detectedSeries = [
    'CEM-903A1D72',
    'CEM-842B9Z13',
    'CEM-913A1D72',
    'CEM-923A1D72',
    'CEM-501X2K11',
    'CEM-852B9Z13',
    'CEM-843B9Z13',
    'CEM-777C4T98',
  ];

  // Lógica para adicionar nova CEM à lista
  const adicionarCEM = (serie) => {
    const existe = cemList.find((c) => c.Serie === serie);
    if (existe) {
      Alert.alert('CEM já vinculada', 'Essa CEM já está associada ao paciente.');
      return;
    }
    setCemList((prev) => [...prev, { Serie: serie, pacientes: 1 }]);
    setModalVisible(false);
  };

  // Renderiza cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Série: {item.Serie}</Text>
        <Text style={styles.patientCount}>Pacientes: {item.pacientes}</Text>
        <TouchableOpacity
          style={styles.visualizarBtn}
          onPress={() =>
            navigation.navigate('Visualizar Medicamentos CEM', {
              serie: item.Serie,
              pacientes: item.pacientes,
            })
          }
        >
          <MaterialCommunityIcons name="pill" size={22} color="#4caf50" />
        </TouchableOpacity>
      </View>

      {/* Indicadores coloridos por paciente */}
      <View style={styles.patientIndicatorRow}>
        {[...Array(item.pacientes)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.patientDot,
              {
                backgroundColor:
                  i === 0 ? '#2196f3' : i === 1 ? '#4caf50' : '#ffeb3b',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="chip" size={28} color="#4caf50" />
          <Text style={styles.title}>Caixa Eletrônica de Medicamento (CEM)</Text>
          <Text style={styles.subtitle}>Edilson Carlos Silva Lima</Text>
        </View>

        {/* Lista de CEMs */}
        <FlatList
          data={cemList}
          keyExtractor={(item) => item.Serie}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma CEM associada.</Text>
          }
        />

        {/* Botão: Adicionar nova CEM */}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="wifi" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar CEM</Text>
        </TouchableOpacity>

        {/* Botão: Voltar */}
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}>Voltar</Text>
        </TouchableOpacity>

        {/* Modal: Adicionar nova CEM */}
        <AddCEMModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={adicionarCEM}
        />
      </View>
    </SafeAreaView>
  );
}
