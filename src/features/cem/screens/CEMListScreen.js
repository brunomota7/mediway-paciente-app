// 📁 src/features/cem/screens/CEMListScreen.js
//
// "Minha Caixa" — a API tem UMA caixa por paciente (L3). Sem lista de CEMs,
// sem contagem de pacientes, sem "detecção via rede".

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/CEMListScreenStyles';
import AddCEMModal from './AddCEMModal';
import { useAuth } from '../../../auth/useAuth';
import { useMedicineBox, useRenameMedicineBox } from '../../../hooks/useMedicineBox';

function RenameBoxModal({ visible, current, onClose }) {
  const rename = useRenameMedicineBox();
  const [nome, setNome] = useState(current || '');
  const [error, setError] = useState('');

  const submit = async () => {
    if (nome.trim().length < 2) {
      setError('Informe um nome válido.');
      return;
    }
    setError('');
    try {
      await rename.mutateAsync(nome.trim());
      onClose();
    } catch (err) {
      setError(err?.message || 'Não foi possível renomear.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0006', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
          <Text style={styles.modalTitle}>Renomear caixa</Text>
          <TextInput
            style={styles.modalInput}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome da caixa"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.addButton, rename.isPending && { opacity: 0.7 }]}
            onPress={submit}
            disabled={rename.isPending}
          >
            {rename.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton} onPress={onClose}>
            <Text style={styles.exitButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function CEMListScreen({ navigation }) {
  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';
  const { data: box, isLoading, isError, error, refetch } = useMedicineBox();

  const [registerVisible, setRegisterVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="chip" size={28} color="#4caf50" />
          <Text style={styles.title}>Caixa Eletrônica de Medicamento (CEM)</Text>
          <Text style={styles.subtitle}>{patientName}</Text>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2e7d32" />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>
              {error?.message || 'Não foi possível carregar a caixa.'}
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={() => refetch()}>
              <Text style={styles.addButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : !box ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.card}>
              <Text style={styles.emptyText}>
                Você ainda não tem uma caixa cadastrada.
              </Text>
              <Text style={styles.boxField}>
                O número de série vem gravado de fábrica na caixa física — você o
                digita no cadastro.
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setRegisterVisible(true)}>
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Cadastrar caixa</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{box.nome || 'Minha caixa'}</Text>
                <TouchableOpacity onPress={() => setRenameVisible(true)}>
                  <MaterialCommunityIcons name="pencil" size={20} color="#4caf50" />
                </TouchableOpacity>
              </View>
              <Text style={styles.boxField}>Número de série</Text>
              <Text style={styles.boxValue}>{box.numeroSerie}</Text>
              <Text style={styles.boxField}>ID externo</Text>
              <Text style={styles.boxValue}>{box.externalId}</Text>
              <Text style={styles.boxField}>
                {box.gavetas.length} gaveta(s) · {box.medicationCount} medicamento(s)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Visualizar Medicamentos CEM')}
            >
              <MaterialCommunityIcons name="pill" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Ver medicamentos</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}>Voltar</Text>
        </TouchableOpacity>

        <AddCEMModal visible={registerVisible} onClose={() => setRegisterVisible(false)} />
        <RenameBoxModal
          visible={renameVisible}
          current={box?.nome}
          onClose={() => setRenameVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
