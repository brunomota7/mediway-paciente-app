// 📄 src/features/exams/screens/EditExamModal.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/AddExamModalStyles'; // reutilizar o estilo da modal de adição

/**
 * Modal para edição de exame
 * Padrão MVVM | Visual Mediway (branco, verde-menta, lavanda)
 */
export default function EditExamModal({ visible, onClose, onSave, exame }) {
  const [Nome, setNome] = useState('');
  const [DataSolicitacao, setDataSolicitacao] = useState(new Date());
  const [DataExameData, setDataExameData] = useState(new Date());
  const [DataExameHora, setDataExameHora] = useState(new Date());
  const [Local, setLocal] = useState('');
  const [Requisito, setRequisito] = useState('');
  const [fkId03, setFkId03] = useState('');
  const [fkId18, setFkId18] = useState('');
  const [fkId16, setFkId16] = useState('');
  const [showDataSolicitacao, setShowDataSolicitacao] = useState(false);
  const [showDataExame, setShowDataExame] = useState(false);
  const [showHoraExame, setShowHoraExame] = useState(false);

  const medicos = [
    { id: '1', nome: 'Dr. Fernando Ribeiro' },
    { id: '2', nome: 'Dra. Larissa Gomes' },
    { id: '3', nome: 'Dra. Pedro Almeida' },
    { id: '4', nome: 'Dra. José Luís' },
    { id: '5', nome: 'Dra. Maria Silva' },
    { id: 'outro', nome: 'Outro médico (não vinculado)' },
  ];

  const acompanhantes = [
    { id: '', nome: 'Nenhum' },
    { id: '1', nome: 'Maria Silva' },
    { id: '2', nome: 'Carlos Alberto' },
    { id: '3', nome: 'Joana Paula' },
    { id: '4', nome: 'Eva Duailibe' },
    { id: '5', nome: 'Aristofani Mendonça' },
    { id: '6', nome: 'Ana Carla' },
  ];

  useEffect(() => {
    if (exame) {
      setNome(exame.Nome || '');
      setDataSolicitacao(exame.DataSolicitacao ? new Date(exame.DataSolicitacao) : new Date());
      setDataExameData(exame.DataExameData ? new Date(exame.DataExameData) : new Date());
      setDataExameHora(exame.DataExameHora ? new Date(exame.DataExameHora) : new Date());
      setLocal(exame.Local || '');
      setRequisito(exame.Requisito || '');
      setFkId03(exame.fkId03 || '');
      setFkId18(exame.fkId18 || '');
      setFkId16(exame.fkId16 || '');
    }
  }, [exame]);

  const handleSalvar = () => {
    if (!Nome || !DataExame || !Local) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    
    const exameAtualizado = {
      ...exame,
      Nome,
      DataSolicitacao,
      DataExameData,
      DataExameHora,
      Local,
      Requisito,
      fkId03,
      fkId18,
      fkId16,
    };

    onSave(exameAtualizado);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="calendar-edit" size={24} color="#4caf50" />
            <Text style={styles.title}>Editar Exame</Text>
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
          value={Nome}
          onChangeText={setNome}
          placeholder="Digite o nome do exame"
        />

        {/* Médico requisitante */}
        <Text style={styles.label}>Médico Requisitante:</Text>
        <View style={styles.input}>
          <Picker selectedValue={fkId18} onValueChange={setFkId18}>
            <Picker.Item label="Selecione um médico..." value="" />
            {medicos.map((m) => (
              <Picker.Item key={m.id} label={m.nome} value={m.id} />
            ))}
          </Picker>
        </View>

        {/* Data Solicitação */}
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
        <View style={styles.input}>
          <Picker selectedValue={fkId16} onValueChange={setFkId16}>
            {acompanhantes.map((a) => (
              <Picker.Item key={a.id} label={a.nome} value={a.id} />
            ))}
          </Picker>
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <MaterialCommunityIcons name="check" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}
