// 📁 src/features/treatments/screens/EditTreatmentModal.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/EditTreatmentModalStyles';

/**
 * Modal para editar um tratamento do paciente
 */
export default function EditTreatmentModal({ visible, onClose, onSave, tratamento }) {
  const [Nome, setNome] = useState('');
  const [Descricao, setDescricao] = useState('');
  const [DataInicio, setDataInicio] = useState('');
  const [DataFim, setDataFim] = useState('');
  const [Status, setStatus] = useState('0');
  const [fkId03, setFkId03] = useState('');

  useEffect(() => {
    if (tratamento) {
      setNome(tratamento.Nome || '');
      setDescricao(tratamento.Descricao || '');
      setStatus(tratamento.Status?.toString() ?? '0');
      setFkId03(tratamento.fkId03 || '');

      const formatarData = (dataIso) => {
        const d = new Date(dataIso);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      };

      setDataInicio(tratamento.DataInicio ? formatarData(tratamento.DataInicio) : '');
      setDataFim(tratamento.DataFim ? formatarData(tratamento.DataFim) : '');
    }
  }, [tratamento]);

  const regexData = /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[0-2])[\/](19|20)\d{2}$/;

  const aplicarMascaraData = (texto) => {
    const cleaned = texto.replace(/\D/g, '');
    let masked = cleaned;

    if (cleaned.length >= 3 && cleaned.length <= 4)
      masked = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    else if (cleaned.length > 4)
      masked = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);

    return masked;
  };

  const handleSalvar = () => {
    if (!Nome || !DataInicio) {
      Alert.alert('Atenção', 'Nome e Data de Início são obrigatórios.');
      return;
    }

    if (!regexData.test(DataInicio)) {
      Alert.alert('Data inválida', 'Data de Início deve estar no formato dd/mm/aaaa.');
      return;
    }

    if (DataFim && !regexData.test(DataFim)) {
      Alert.alert('Data inválida', 'Data de Fim deve estar no formato dd/mm/aaaa.');
      return;
    }

    const dataInicioISO = new Date(DataInicio.split('/').reverse().join('-')).toISOString();
    const dataFimISO = DataFim ? new Date(DataFim.split('/').reverse().join('-')).toISOString() : null;

    const dadosAtualizados = {
      Id09: tratamento.Id09,
      Nome,
      Descricao,
      DataInicio: dataInicioISO,
      DataFim: dataFimISO,
      Status: parseInt(Status),
      fkId03,
    };

    onSave(dadosAtualizados);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          {/* 🔹 Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="pill" size={24} color="#4caf50" />
              <Text style={styles.title}>Editar Tratamento</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Nome */}
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={Nome}
            onChangeText={setNome}
            placeholder="Digite o nome do tratamento"
          />

          {/* Descrição */}
          <Text style={styles.label}>Descricao</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={Descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            placeholder="Digite a descrição do tratamento"
          />

          {/* 📅 Data Início */}
          <Text style={styles.label}>DataInicio</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/aaaa"
            keyboardType="numeric"
            maxLength={10}
            value={DataInicio}
            onChangeText={(text) => setDataInicio(aplicarMascaraData(text))}
          />

          {/* 📅 Data Fim */}
          <Text style={styles.label}>DataFim</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/aaaa"
            keyboardType="numeric"
            maxLength={10}
            value={DataFim}
            onChangeText={(text) => setDataFim(aplicarMascaraData(text))}
          />

          {/* ✅ Status */}
          <View style={styles.switchRow}>
            <Text style={styles.label}>Status: {Status === '0' ? 'Ativo' : 'Inativo'}</Text>
            <Switch
              value={Status === '0'}
              onValueChange={(val) => setStatus(val ? '0' : '1')}
              trackColor={{ false: '#ccc', true: '#81c784' }}
              thumbColor="#4caf50"
            />
          </View>

          {/* 💾 Botões */}
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleSalvar}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
            <Text style={styles.buttonPrimaryText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={styles.buttonSecondaryText}>Voltar para Lista de Tratamentos</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
