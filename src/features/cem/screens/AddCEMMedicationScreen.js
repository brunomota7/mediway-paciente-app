// 📁 src/features/cem/screens/AddCEMMedicationScreen.js
//
// Adiciona um medicamento à caixa existente (M3). Sem auto-preenchimento
// farmacológico (era mock e não há endpoint).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/AddCEMMedicationScreenStyles';
import MedicationForm from '../../medications/components/MedicationForm';
import { useMedicineBox } from '../../../hooks/useMedicineBox';
import { useCreateMedication } from '../../../hooks/useMedications';

export default function AddCEMMedicationScreen({ route, navigation }) {
  const initialGaveta = route?.params?.gaveta ?? '';
  const { data: box } = useMedicineBox();
  const create = useCreateMedication();
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    if (!box?.id) {
      setError('Cadastre a caixa antes de adicionar medicamentos.');
      return;
    }
    setError('');
    try {
      await create.mutateAsync({ ...payload, medicineBoxId: box.id });
      navigation.goBack();
    } catch (err) {
      setError(err?.message || 'Não foi possível salvar o medicamento.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Adicionar Medicamento na CEM</Text>
          {box?.numeroSerie ? (
            <Text style={styles.subtitle}>Série da CEM: {box.numeroSerie}</Text>
          ) : null}
        </View>

        <MedicationForm
          initialGaveta={initialGaveta}
          submitting={create.isPending}
          disabled={!box?.id}
          externalError={error}
          submitLabel="Salvar Medicamento na CEM"
          onSubmit={handleSubmit}
        />

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
