// 📁 src/features/exams/screens/ExamListScreen.js
//
// Lista de exames do paciente — SOMENTE LEITURA (L2). Dados de `GET /exam/me`
// via `useExams`. Sem agendar/editar/cancelar (endpoints exigem ADMIN/CUIDADOR/MÉDICO).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExamTabs from '../components/ExamTabs';
import styles from '../styles/ExamListScreenStyles';
import { useAuth } from '../../../auth/useAuth';
import { useExams } from '../../../hooks/useExams';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateViews';

export default function ExamListScreen({ navigation }) {
  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';

  const {
    data: exames = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useExams();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Exames</Text>
        <Text style={styles.subtitle}>{patientName}</Text>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message={error?.message} onRetry={refetch} />
        ) : exames.length === 0 ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          >
            <EmptyState icon="flask-empty-outline" message="Você ainda não tem exames." />
          </ScrollView>
        ) : (
          <ExamTabs exames={exames} />
        )}

        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
