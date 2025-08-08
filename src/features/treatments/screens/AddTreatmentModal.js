// 📁 src/features/treatments/screens/AddTreatmentModal.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/AddTreatmentModalStyles';

/**
 * Modal para adicionar um novo tratamento
 * Segue padrão MVVM com estilo Mediway (branco, verde-menta, lavanda)
 */
export default function AddTreatmentModal({ visible, onClose, onSave }) {
  const [Nome, setNome] = useState('');
  const [Descricao, setDescricao] = useState('');
  const [DataInicio, setDataInicio] = useState('');
  const [Status, setStatus] = useState('0'); // 0 = Ativo, 1 = Inativo
  const fkId03 = '123'; // Simulado (ID do paciente)

  const regexData = /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[0-2])[\/](19|20)\d{2}$/;

  const handleSalvar = () => {
    if (!Nome || !DataInicio) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
      return;
    }

    if (!regexData.test(DataInicio)) {
      Alert.alert('Data inválida', 'A data deve estar no formato dd/mm/aaaa.');
      return;
    }

    const [dia, mes, ano] = DataInicio.split('/');
    const dataConvertida = new Date(`${ano}-${mes}-${dia}T00:00:00`);

    const novoTratamento = {
      Nome,
      Descricao,
      DataInicio: dataConvertida.toISOString(),
      Status,
      fkId03,
    };

    onSave(novoTratamento);
    onClose();
    limparFormulario();
  };

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setDataInicio('');
    setStatus('0');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* 🔹 Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="hospital-box-outline" size={24} color="#4caf50" />
            <Text style={styles.title}>Novo Tratamento</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* 🏷️ Nome */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do tratamento"
          value={Nome}
          onChangeText={setNome}
        />

        {/* 📝 Descrição */}
        <Text style={styles.label}>Descricao</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o tratamento"
          value={Descricao}
          onChangeText={setDescricao}
          multiline
        />

        {/* 📅 Data Início (digitável e validada) */}
        <Text style={styles.label}>DataInicio</Text>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/aaaa"
          keyboardType="numeric"
          value={DataInicio}
          maxLength={10}
          onChangeText={(text) => {
            // Remove tudo que não for dígito
            const cleaned = text.replace(/\D/g, '');

            // Aplica a máscara
            let masked = cleaned;
            if (cleaned.length >= 3 && cleaned.length <= 4)
              masked = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
            else if (cleaned.length > 4)
              masked = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);

            setDataInicio(masked);
          }}
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

        {/* 💾 Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <MaterialCommunityIcons name="check" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>

        {/* 🔙 Botão Voltar */}
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.cancelButtonText}>Voltar para Lista de Tratamentos</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
