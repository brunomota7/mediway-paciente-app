// 📁 src/features/medications/screens/EditMedicationModal.js
//
// A API não tem edição completa de medicação (L4): só PATCH status e DELETE.
// Este modal mostra os dados (somente leitura) e permite suspender / reativar
// / excluir. Para alterar dados, exclua e cadastre de novo.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/AddMedicationModalStyles';
import { useRemoveMedication, useSetMedicationStatus } from '../../../hooks/useMedications';

export default function EditMedicationModal({ visible, onClose, medicamento }) {
  const setStatus = useSetMedicationStatus();
  const remove = useRemoveMedication();
  const [error, setError] = useState('');

  if (!medicamento) return null;

  const isActive = medicamento.status === 'ATIVO';
  const busy = setStatus.isPending || remove.isPending;

  const handleToggle = async () => {
    setError('');
    try {
      await setStatus.mutateAsync({
        id: medicamento.id,
        status: isActive ? 'SUSPENSO' : 'ATIVO',
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Não foi possível alterar o status.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir medicamento', `Remover "${medicamento.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setError('');
          try {
            await remove.mutateAsync(medicamento.id);
            onClose();
          } catch (err) {
            setError(err?.message || 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  const Row = ({ label, value }) =>
    value ? (
      <Text style={styles.label}>
        {label}: <Text style={{ fontWeight: 'normal' }}>{value}</Text>
      </Text>
    ) : null;

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="pill" size={24} color="#4caf50" />
              <Text style={styles.title}>{medicamento.nome}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <Row label="Status" value={medicamento.statusLabel} />
          <Row label="Tipo" value={medicamento.tipoLabel} />
          <Row label="Referência" value={medicamento.nomeReferencia} />
          <Row label="Descrição" value={medicamento.descricao} />
          <Row label="Concentração" value={medicamento.concentracao} />
          <Row label="Quantidade" value={medicamento.quantidade} />
          <Row label="Dias" value={medicamento.diasLabel} />
          <Row label="Horário" value={medicamento.hora} />
          <Row label="Gaveta" value={medicamento.gaveta} />
          <Row label="Estoque" value={String(medicamento.estoque)} />

          <Text style={{ color: '#888', fontSize: 12, marginTop: 16 }}>
            A API não permite editar os dados de uma medicação. Para alterar,
            exclua e cadastre novamente.
          </Text>

          {error ? (
            <Text style={{ color: '#d32f2f', marginTop: 12 }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.saveButton, busy && { opacity: 0.7 }]}
            onPress={handleToggle}
            disabled={busy}
          >
            {setStatus.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={isActive ? 'pause-circle' : 'play-circle'}
                  size={20}
                  color="#fff"
                />
                <Text style={styles.saveButtonText}>
                  {isActive ? 'Suspender' : 'Reativar'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: '#e53935' }, busy && { opacity: 0.7 }]}
            onPress={handleDelete}
            disabled={busy}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#e53935" />
            <Text style={[styles.cancelButtonText, { color: '#e53935' }]}>Excluir</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
