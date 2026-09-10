// 📁 src/features/cem/screens/AddCEMModal.js
//
// Cadastro da caixa do paciente (X2 — POST /medicine-box/register/{patientId}).
// A API exige numeroSerie + ao menos 1 gaveta com ao menos 1 medicamento, tudo
// numa chamada. `numeroSerie` é digitado (gravado de fábrica na caixa física).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import medStyles from '../../medications/styles/AddMedicationModalStyles';
import MedicationForm from '../../medications/components/MedicationForm';
import { useRegisterMedicineBox } from '../../../hooks/useMedicineBox';

function describeConflict(err) {
  const msg = String(err?.message || '').toLowerCase();
  if (msg.includes('serie') || msg.includes('série')) {
    return 'Esse número de série já está em uso em outra caixa.';
  }
  return 'Você já possui uma caixa cadastrada.';
}

export default function AddCEMModal({ visible, onClose }) {
  const register = useRegisterMedicineBox();
  const [numeroSerie, setNumeroSerie] = useState('');
  const [nomeCaixa, setNomeCaixa] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setNumeroSerie('');
    setNomeCaixa('');
    setError('');
  };
  const close = () => {
    reset();
    onClose();
  };

  // MedicationForm entrega o payload da 1ª medicação; aqui montamos o aninhado.
  const handleRegister = async (medPayload) => {
    if (numeroSerie.trim().length < 3) {
      setError('Informe o número de série gravado na caixa.');
      return;
    }
    setError('');

    const { status, gaveta, ...med } = medPayload;
    const payload = {
      numeroSerie: numeroSerie.trim(),
      nome: nomeCaixa.trim() || undefined,
      gavetas: [
        {
          nome: (gaveta && gaveta.trim()) || 'Gaveta 1',
          medicamentos: [med],
        },
      ],
    };

    try {
      await register.mutateAsync(payload);
      close();
    } catch (err) {
      if (err?.status === 409) setError(describeConflict(err));
      else setError(err?.message || 'Não foi possível cadastrar a caixa.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={medStyles.safeArea}>
        <ScrollView contentContainerStyle={medStyles.container} keyboardShouldPersistTaps="handled">
          <View style={medStyles.header}>
            <View style={medStyles.headerLeft}>
              <MaterialCommunityIcons name="package-variant-closed" size={24} color="#4caf50" />
              <Text style={medStyles.title}>Cadastrar Caixa</Text>
            </View>
            <TouchableOpacity onPress={close}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <Text style={medStyles.label}>Número de série *</Text>
          <TextInput
            style={medStyles.input}
            value={numeroSerie}
            onChangeText={setNumeroSerie}
            placeholder="Ex.: MDW-2026-000123"
            autoCapitalize="characters"
          />

          <Text style={medStyles.label}>Nome da caixa</Text>
          <TextInput
            style={medStyles.input}
            value={nomeCaixa}
            onChangeText={setNomeCaixa}
            placeholder='Ex.: "Caixa da sala"'
          />

          <Text style={[medStyles.title, { fontSize: 16, marginTop: 20 }]}>
            Primeiro medicamento
          </Text>
          <Text style={medStyles.warnText}>
            A caixa precisa de ao menos um medicamento no cadastro. O campo "Gaveta"
            vira o nome da primeira gaveta.
          </Text>

          <MedicationForm
            submitting={register.isPending}
            externalError={error}
            submitLabel="Cadastrar caixa"
            onSubmit={handleRegister}
          />

          <TouchableOpacity style={medStyles.cancelButton} onPress={close}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={medStyles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
