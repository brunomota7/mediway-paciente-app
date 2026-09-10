// 📁 src/features/vaccines/screens/VaccineHistoryScreen.js
//
// Carteira de vacinas — SOMENTE LEITURA (L1). Dados de GET /vaccine/me
// (useVaccines). O paciente não registra/edita/exclui vacinas (endpoints
// exigem ADMIN/CUIDADOR/MÉDICO).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/VaccineHistoryScreenStyles';
import { useAuth } from '../../../auth/useAuth';
import { useVaccines } from '../../../hooks/useVaccines';
import { Gender } from '../../../lib/enums';
import { toBrDate } from '../../../lib/datetime';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateViews';

const STATUS_COLOR = { APLICADA: '#2e7d32', AGENDADA: '#1976d2', ATRASADA: '#e53935' };

export default function VaccineHistoryScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';
  const patientDetails = [
    user?.dateOfBirth ? `Nascimento: ${toBrDate(user.dateOfBirth)}` : null,
    user?.age != null ? `Idade: ${user.age}` : null,
    user?.gender ? `Sexo: ${Gender.label(user.gender)}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  const { data: vacinas = [], isLoading, isError, error, refetch, isRefetching } = useVaccines();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="needle" size={20} color="#2e7d32" />
        <Text style={styles.vaccineName}>{item.nome}</Text>
      </View>

      <View
        style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] ?? '#9e9e9e' }]}
      >
        <Text style={styles.statusText}>{item.statusLabel}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardField}>
          <Text style={styles.fieldLabel}>Tipo de dose:</Text> {item.tipoDoseLabel}
        </Text>
        {item.dataVacinouLabel ? (
          <Text style={styles.cardField}>
            <Text style={styles.fieldLabel}>Data:</Text> {item.dataVacinouLabel}
          </Text>
        ) : null}
        {item.lote ? (
          <Text style={styles.cardField}>
            <Text style={styles.fieldLabel}>Lote:</Text> {item.lote}
          </Text>
        ) : null}
        {item.dataFabricacaoLabel ? (
          <Text style={styles.cardField}>
            <Text style={styles.fieldLabel}>Fabricação:</Text> {item.dataFabricacaoLabel}
          </Text>
        ) : null}
        {item.proximaDoseLabel ? (
          <Text style={styles.cardField}>
            <Text style={styles.fieldLabel}>Próxima dose:</Text> {item.proximaDoseLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Carteira de Vacinas</Text>
        </View>

        <View style={styles.patientInfo}>
          <MaterialCommunityIcons name="account-circle" size={26} color="#4caf50" />
          <View>
            <Text style={styles.patientName}>{patientName}</Text>
            {patientDetails ? (
              <Text style={styles.patientDetails}>{patientDetails}</Text>
            ) : null}
          </View>
        </View>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <FlatList
          data={vacinas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={
            vacinas.length === 0 ? { flexGrow: 1 } : { padding: 16, paddingBottom: 80 }
          }
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState icon="needle" message="Nenhuma vacina registrada." />
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
