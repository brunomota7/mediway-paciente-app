// 📁 src/features/cem/screens/EditCEMMedicationScreen.js
//
// A API não edita dados de medicação (L4): só suspender/reativar (M4) e
// remover da caixa (X4 — DELETE /medicine-box/me/medication/{id}).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/EditCEMMedicationScreenStyles';
import { useMedicineBox, useDeleteBoxMedication } from '../../../hooks/useMedicineBox';
import { useSetMedicationStatus } from '../../../hooks/useMedications';

export default function EditCEMMedicationScreen({ route, navigation }) {
  const medicationId = route?.params?.medicationId ?? null;
  const { data: box, isLoading } = useMedicineBox();
  const setStatus = useSetMedicationStatus();
  const removeFromBox = useDeleteBoxMedication();
  const [error, setError] = useState('');

  const found = useMemo(() => {
    if (!box) return null;
    for (const g of box.gavetas) {
      const m = g.medicamentos.find((x) => String(x.id) === String(medicationId));
      if (m) return { med: m, gaveta: g.nome };
    }
    return null;
  }, [box, medicationId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      </SafeAreaView>
    );
  }

  if (!found) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <Text style={styles.subtitle}>Medicamento não encontrado na caixa.</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={styles.cancelButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { med, gaveta } = found;
  const isActive = med.status === 'ATIVO';
  const busy = setStatus.isPending || removeFromBox.isPending;

  const toggle = async () => {
    setError('');
    try {
      await setStatus.mutateAsync({ id: med.id, status: isActive ? 'SUSPENSO' : 'ATIVO' });
      navigation.goBack();
    } catch (err) {
      setError(err?.message || 'Não foi possível alterar o status.');
    }
  };

  const excluir = () => {
    Alert.alert('Excluir medicamento', `Remover "${med.nome}" da caixa?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setError('');
          try {
            await removeFromBox.mutateAsync(med.id);
            navigation.goBack();
          } catch (err) {
            setError(err?.message || 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  const Detail = ({ label, value }) =>
    value ? <Text style={styles.detailValue}>{label}: {value}</Text> : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{med.nome}</Text>
          <Text style={styles.subtitle}>
            Gaveta: {gaveta || '—'} · {med.statusLabel}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Detail label="Tipo" value={med.tipoLabel} />
          <Detail label="Referência" value={med.nomeReferencia} />
          <Detail label="Descrição" value={med.descricao} />
          <Detail label="Concentração" value={med.concentracao} />
          <Detail label="Quantidade" value={med.quantidade} />
          <Detail label="Dias" value={med.diasLabel} />
          <Detail label="Horário" value={med.hora} />
          <Detail label="Estoque" value={String(med.estoque)} />
        </View>

        <Text style={{ color: '#888', fontSize: 12, marginTop: 12 }}>
          A API não permite editar os dados. Para alterar, exclua e cadastre de novo.
        </Text>

        {error ? <Text style={{ color: '#d32f2f', marginTop: 12 }}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.saveButton, busy && { opacity: 0.7 }]}
          onPress={toggle}
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
          style={[styles.deleteButton, busy && { opacity: 0.7 }]}
          onPress={excluir}
          disabled={busy}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Excluir Medicamento da CEM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
