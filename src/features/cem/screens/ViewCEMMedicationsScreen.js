// 📁 src/features/cem/screens/ViewCEMMedicationsScreen.js
//
// Medicamentos da caixa, agrupados por gaveta (dados reais de GET /medicine-box/me).

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/ViewCEMMedicationsStyles';
import { useAuth } from '../../../auth/useAuth';
import { useClearGaveta, useMedicineBox } from '../../../hooks/useMedicineBox';

export default function ViewCEMMedicationsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';

  const { data: box, isLoading, isError, error, refetch } = useMedicineBox();
  const clearGaveta = useClearGaveta();

  const handleClearGaveta = (nome) => {
    Alert.alert('Esvaziar gaveta', `Remover todos os medicamentos de "${nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Esvaziar',
        style: 'destructive',
        onPress: () => clearGaveta.mutate(nome),
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <Text style={styles.subtitle}>
            {error?.message || 'Não foi possível carregar a caixa.'}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => refetch()}>
            <Text style={styles.backButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!box) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <Text style={styles.subtitle}>Você ainda não tem uma caixa cadastrada.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="chip" size={28} color="#4caf50" />
          <Text style={styles.title}>Medicamentos da CEM</Text>
          <Text style={styles.subtitle}>
            {patientName} · Série: {box.numeroSerie}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
          {box.gavetas.length === 0 ? (
            <Text style={styles.explanationText}>Nenhuma gaveta na caixa.</Text>
          ) : (
            box.gavetas.map((g, gi) => (
              <View key={g.nome ?? gi} style={{ marginBottom: 18 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.title}>{g.nome || `Gaveta ${gi + 1}`}</Text>
                  {g.medicamentos.length > 0 && g.nome ? (
                    <TouchableOpacity onPress={() => handleClearGaveta(g.nome)}>
                      <MaterialCommunityIcons name="delete-sweep" size={22} color="#e53935" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {g.medicamentos.length === 0 ? (
                  <Text style={styles.explanationText}>Gaveta vazia.</Text>
                ) : (
                  g.medicamentos.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() =>
                        navigation.navigate('Editar Medicamento CEM', { medicationId: m.id })
                      }
                    >
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#c8e6c9',
                          borderRadius: 8,
                          padding: 12,
                          marginTop: 8,
                          backgroundColor: '#f9f9f9',
                        }}
                      >
                        <Text style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                          {m.nome}{' '}
                          <Text style={{ fontWeight: 'normal', color: '#888' }}>
                            ({m.statusLabel})
                          </Text>
                        </Text>
                        {m.diasLabel ? (
                          <Text style={styles.explanationText}>
                            {m.diasLabel} · {m.hora} · estoque {m.estoque}
                          </Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Adicionar Medicamento CEM')}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#388e3c" />
          <Text style={styles.backButtonText}>Adicionar medicamento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { marginTop: 8 }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
