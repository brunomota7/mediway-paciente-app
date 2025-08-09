// import { StyleSheet } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/AddExamModalStyles';

/**
 * Modal para cadastro de novo exame
 * Segue padrão MVVM e identidade visual Mediway
 */
export default function AddExamModal({ visible, onClose, onSave }) {
  const [Nome, setNome] = useState('');
  const [DataSolicitacao, setDataSolicitacao] = useState(new Date());
  const [DataExameData, setDataExameData] = useState(new Date());
  const [DataExameHora, setDataExameHora] = useState(new Date());
  const [Local, setLocal] = useState('');
  const [Requisito, setRequisito] = useState('');
  const [fkId03] = useState('123'); // paciente (mock)
  const [fkId18, setFkId18] = useState('');
  const [fkId16, setFkId16] = useState('');
  const [showDataSolicitacao, setShowDataSolicitacao] = useState(false);
  const [showDataExame, setShowDataExame] = useState(false);
  const [showHoraExame, setShowHoraExame] = useState(false);

  const medicos = [
    { id: '1', nome: 'Dr. Fernando Ribeiro' },
    { id: '2', nome: 'Dra. Larissa Gomes' },
    { id: '3', nome: 'Dra. Pedro Almeida' },
  ];

  const acompanhantes = [
    { id: '1', nome: 'Maria Silva' },
    { id: '2', nome: 'Carlos Alberto' },
    { id: '3', nome: 'Joana Paula' },
  ];

  const handleSalvar = () => {
    if (!Nome || !Local || !DataExameData) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const novoExame = {
      Nome,
      DataSolicitacao,
      DataExameData,
      DataExameHora,
      Local,
      Requisito,
      Situacao: 0, // Marcado
      fkId03,
      fkId18,
      fkId16,
    };

    onSave(novoExame);
    onClose();
    limpar();
  };

  const limpar = () => {
    setNome('');
    setLocal('');
    setRequisito('');
    setFkId18('');
    setFkId16('');
    setDataSolicitacao(new Date());
    setDataExameData(new Date());
    setDataExameHora(new Date());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="flask" size={24} color="#4caf50" />
              <Text style={styles.title}>Cadastrar Novo Exame</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Edilson Carlos Silva Lima</Text>

          {/* Nome */}
          <Text style={styles.label}>Nome do Exame</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do exame"
            value={Nome}
            onChangeText={setNome}
          />

          {/* Médico Requisitante */}
          <Text style={styles.label}>Médico Requisitante:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fkId18}
              onValueChange={setFkId18}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecione..." value="" />
              {medicos.map((m) => (
                <Picker.Item key={m.id} label={m.nome} value={m.id} />
              ))}
            </Picker>
          </View>

          {/* Data de Solicitação */}
          <Text style={styles.label}>Data de Solicitação:</Text>
          <TouchableOpacity style={styles.dateField} onPress={() => setShowDataSolicitacao(true)}>
            <MaterialCommunityIcons name="calendar" size={20} color="#4caf50" />
            <Text style={styles.dateText}>{DataSolicitacao.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDataSolicitacao && (
            <DateTimePicker
              value={DataSolicitacao}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDataSolicitacao(false);
                if (date) setDataSolicitacao(date);
              }}
            />
          )}

          {/* Data do Exame */}
          <Text style={styles.label}>Data do Exame:</Text>
          <TouchableOpacity style={styles.dateField} onPress={() => setShowDataExame(true)}>
            <MaterialCommunityIcons name="calendar" size={20} color="#4caf50" />
            <Text style={styles.dateText}>{DataExameData.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDataExame && (
            <DateTimePicker
              value={DataExameData}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDataExame(false);
                if (date) setDataExameData(date);
              }}
            />
          )}

          {/* Hora do Exame */}
          <Text style={styles.label}>Hora do Exame:</Text>
          <TouchableOpacity style={styles.dateField} onPress={() => setShowHoraExame(true)}>
            <MaterialCommunityIcons name="clock-time-four" size={20} color="#4caf50" />
            <Text style={styles.dateText}>
              {DataExameHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showHoraExame && (
            <DateTimePicker
              value={DataExameHora}
              mode="time"
              display="default"
              onChange={(_, date) => {
                setShowHoraExame(false);
                if (date) setDataExameHora(date);
              }}
            />
          )}

          {/* Local */}
          <Text style={styles.label}>Local:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o local do exame"
            value={Local}
            onChangeText={setLocal}
          />

          {/* Requisitos */}
          <Text style={styles.label}>Pré-requisitos:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Jejum, preparo etc."
            value={Requisito}
            onChangeText={setRequisito}
            multiline
          />

          {/* Acompanhante */}
          <Text style={styles.label}>Acompanhante:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fkId16}
              onValueChange={setFkId16}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Nenhum" value="" />
              {acompanhantes.map((a) => (
                <Picker.Item key={a.id} label={a.nome} value={a.id} />
              ))}
            </Picker>
          </View>

          {/* Botões */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={styles.cancelButtonText}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
