// 📁 src/features/medications/screens/AddMedicationModal.js
//
// Adiciona uma medicação a uma caixa JÁ existente (M3). Requer `medicineBoxId`.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/AddMedicationModalStyles';
import MedicationForm from '../components/MedicationForm';
import { useCreateMedication } from '../../../hooks/useMedications';

export default function AddMedicationModal({ visible, onClose, medicineBoxId }) {
  const create = useCreateMedication();
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    setError('');
    try {
      await create.mutateAsync({ ...payload, medicineBoxId });
      onClose();
    } catch (err) {
      setError(err?.message || 'Não foi possível salvar o medicamento.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="pill" size={24} color="#4caf50" />
              <Text style={styles.title}>Adicionar Medicamento</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          {!medicineBoxId ? (
            <View style={styles.warnBox}>
              <Text style={styles.warnText}>
                Você ainda não tem uma caixa cadastrada. Cadastre-a na tela CEM para
                poder adicionar medicamentos.
              </Text>
            </View>
          ) : null}

          <MedicationForm
            submitting={create.isPending}
            disabled={!medicineBoxId}
            externalError={error}
            onSubmit={handleSubmit}
          />

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
