// 📁 src/features/consultations/screens/ConsultationListScreen.js
//
// Lista de consultas do paciente — SOMENTE LEITURA (L2). Dados de
// `GET /consultation/me` via `useConsultations`. Sem agendar/editar/cancelar
// (endpoints exigem ADMIN/MÉDICO/CUIDADOR).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ConsultationTabs from '../components/ConsultationTabs';
import styles from '../styles/ConsultationListScreenStyles';
import { useAuth } from '../../../auth/useAuth';
import { useConsultations } from '../../../hooks/useConsultations';

export default function ConsultationListScreen({ navigation }) {
  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';

  const {
    data: consultas = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useConsultations();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Consultas</Text>
        <Text style={styles.subtitle}>{patientName}</Text>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2e7d32" />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>
              {error?.message || 'Não foi possível carregar as consultas.'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : consultas.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.centered}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          >
            <MaterialCommunityIcons name="calendar-blank" size={48} color="#c8e6c9" />
            <Text style={styles.errorText}>Você ainda não tem consultas.</Text>
          </ScrollView>
        ) : (
          <ConsultationTabs consultas={consultas} />
        )}

        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
