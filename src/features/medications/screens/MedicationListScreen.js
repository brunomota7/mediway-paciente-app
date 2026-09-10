// 📁 src/features/medications/screens/MedicationListScreen.js
//
// Lista de medicações do paciente. Dados de GET /medications/me (useMedications).
// Ações suportadas pela API: adicionar (à caixa existente), suspender/reativar,
// excluir. Não há edição completa (L4).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import MedicationTabs from '../components/MedicationTabs';
import styles from '../styles/MedicationListScreenStyles';
import AddMedicationModal from './AddMedicationModal';
import EditMedicationModal from './EditMedicationModal';
import { useAuth } from '../../../auth/useAuth';
import { useMedications } from '../../../hooks/useMedications';
import { useMedicineBox } from '../../../hooks/useMedicineBox';

export default function MedicationListScreen({ navigation }) {
  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';

  const { data: medications = [], isLoading, isError, error, refetch } = useMedications();
  const { data: box } = useMedicineBox();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const openEdit = (m) => {
    setSelected(m);
    setEditVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleView}>
            <MaterialCommunityIcons name="pill" size={24} color="#4caf50" />
            <Text style={styles.title}>Medicamentos</Text>
          </View>
          <Text style={styles.subtitle}>{patientName}</Text>
        </View>

        <View style={styles.contentContainer}>
          {isLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#2e7d32" />
            </View>
          ) : isError ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <Text style={{ color: '#d32f2f', textAlign: 'center', marginBottom: 12 }}>
                {error?.message || 'Não foi possível carregar os medicamentos.'}
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={() => refetch()}>
                <Text style={styles.addButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <MedicationTabs medicamentos={medications} onEdit={openEdit} />
          )}
        </View>

        <View style={styles.areaBtnInferiores}>
          <TouchableOpacity style={styles.addButton} onPress={() => setAddVisible(true)}>
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Novo Medicamento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
            <Text style={styles.exitButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <AddMedicationModal
          visible={addVisible}
          onClose={() => setAddVisible(false)}
          medicineBoxId={box?.id ?? null}
        />

        {selected && (
          <EditMedicationModal
            visible={editVisible}
            onClose={() => {
              setEditVisible(false);
              setSelected(null);
            }}
            medicamento={selected}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
