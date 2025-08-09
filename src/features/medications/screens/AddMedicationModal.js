// 📁 src/features/medications/screens/AddMedicationModal.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import styles from '../styles/AddMedicationModalStyles';

/**
 * Modal para Adicionar Novo Medicamento
 * Padrão MVVM | Visual Mediway (branco, verde-menta, lavanda)
 */
export default function AddMedicationModal({ visible, onClose, onSave }) {
  const [Nome, setNome] = useState('');
  const [Tipo, setTipo] = useState('');
  const [NomeReferencia, setNomeReferencia] = useState('');
  const [Descricao, setDescricao] = useState('');
  const [Concentracao, setConcentracao] = useState('');
  const [Quantidade, setQuantidade] = useState('');
  const [Dias, setDias] = useState('');
  const [Horarios, setHorarios] = useState('');
  const [Gaveta, setGaveta] = useState('');
  const [Estoque, setEstoque] = useState('');
  const [Status, setStatus] = useState(0);      // 0 = Ativo

  const handleSalvar = () => {
    if (!Nome || !Tipo || !Quantidade || !Dias || !Horarios) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const novoMedicamento = {
      Id11: Date.now(),
      Nome,
      Tipo,
      NomeReferencia,
      Descricao,
      Concentracao,
      Quantidade,
      Dias,
      Horarios,
      Gaveta,
      Estoque,
      Status,
    };
  };

  const limpar = () => {
    setNome('');
    setTipo('');
    setNomeReferencia('');
    setDescricao('');
    setConcentracao('');
    setQuantidade('');
    setDias('');
    setHorarios('');
    setGaveta('');
    setEstoque('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="pill" size={24} color="#4caf50" />
              <Text style={styles.title}>Adicionar Medicamento</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input} value={Nome}
            onChangeText={setNome} placeholder="Nome do medicamento"
          />

          <Text style={styles.label}>Tipo</Text>
          <TextInput
            style={styles.input} value={Tipo}
            onChangeText={setTipo} placeholder="Ex: Genérico, Referência..."
          />

          <Text style={styles.label}>Nome de Referência</Text>
          <TextInput
            style={styles.input} value={Tipo}
            onChangeText={setTipo} placeholder="Ex: Genérico, Referência..."
          />


          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            value={Descricao}
            onChangeText={setDescricao}
            placeholder="Descrição completa ou bula"
          />

          <Text style={styles.label}>Concentração</Text>
          <TextInput style={styles.input} value={Concentracao} onChangeText={setConcentracao} placeholder="Ex: 500mg" />

          <Text style={styles.label}>Quantidade por aplicação</Text>
          <TextInput style={styles.input} value={Quantidade} onChangeText={setQuantidade} placeholder="Ex: 1 comprimido" />

          <Text style={styles.label}>Dias de uso</Text>
          <TextInput style={styles.input} value={Dias} onChangeText={setDias} placeholder="Ex: Seg, Qua, Sex" />

          <Text style={styles.label}>Horários</Text>
          <TextInput style={styles.input} value={Horarios} onChangeText={setHorarios} placeholder="Ex: 08:00, 20:00" />

          <Text style={styles.label}>Gaveta na CEM</Text>
          <TextInput style={styles.input} value={Gaveta} onChangeText={setGaveta} placeholder="Ex: A1, B2..." />

          <Text style={styles.label}>Estoque (CEM)</Text>
          <TextInput style={styles.input} value={Estoque} onChangeText={setEstoque} placeholder="Quantidade na CEM" />

          {/* Botões */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={styles.cancelButtonText}>Voltar para Lista de Medicamentos</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
