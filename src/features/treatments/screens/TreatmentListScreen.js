// 📁 src/features/treatments/screens/TreatmentListScreen.js
//
// Tratamentos do paciente — SOMENTE LEITURA. GET /treatment/me (novo, ver
// REVISAO_POS_BACKEND.md §3 P.7). Criar/editar/excluir é ADMIN/MÉDICO/CUIDADOR.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList, RefreshControl, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';

import styles from '../styles/TreatmentListScreenStyles';
import { useTreatments } from '../../../hooks/useTreatments';
import { treatmentStatusColor } from '../../../lib/statusColors';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateViews';

export default function TreatmentListScreen() {
  const navigation = useNavigation();
  const { data: treatments = [], isLoading, isError, error, refetch, isRefetching } =
    useTreatments();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.treatmentName}>{item.nome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: treatmentStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.statusLabel}</Text>
        </View>
      </View>

      {item.descricao ? <Text style={styles.cardField}>{item.descricao}</Text> : null}
      <Text style={styles.cardField}>
        <Text style={styles.fieldLabel}>Início:</Text> {item.dataInicioLabel || '—'}
      </Text>
      <Text style={styles.cardField}>
        <Text style={styles.fieldLabel}>Término:</Text> {item.dataFimLabel || '—'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <MaterialCommunityIcons name="hospital-box" size={24} color="#2e7d32" />
          <Text style={styles.title}>Tratamentos</Text>
        </View>
        <Text style={styles.subtitle}>
          Acompanhamento definido pela sua equipe de cuidado.
        </Text>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <FlatList
          data={treatments}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={
            treatments.length === 0 ? { flexGrow: 1 } : { padding: 16, paddingBottom: 96 }
          }
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState icon="hospital-box-outline" message="Nenhum tratamento registrado." />
          }
        />
      )}

      <View style={styles.fixedButtons}>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}> Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
