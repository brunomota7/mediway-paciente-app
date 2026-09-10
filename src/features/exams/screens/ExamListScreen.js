// 📁 src/features/exams/screens/ExamListScreen.js
//
// Lista de exames do paciente — SOMENTE LEITURA (L2). Dados de `GET /exam/me`
// via `useExams`. Sem agendar/editar/cancelar (endpoints exigem ADMIN/CUIDADOR/MÉDICO).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExamTabs from '../components/ExamTabs';
import styles from '../styles/ExamListScreenStyles';
import { useAuth } from '../../../auth/useAuth';
import { useExams } from '../../../hooks/useExams';

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
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2e7d32" />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>
              {error?.message || 'Não foi possível carregar os exames.'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : exames.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.centered}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          >
            <MaterialCommunityIcons name="flask-empty-outline" size={48} color="#c8e6c9" />
            <Text style={styles.errorText}>Você ainda não tem exames.</Text>
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
