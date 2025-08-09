// 📁 src/features/consultations/screens/EditConsultationModal.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/AddConsultationModalStyles'; // reutiliza o estilo da modal de adição

export default function EditConsultationModal({ visible, onClose, onSave, consulta }) {
  const [Nome, setNome] = useState('');
  const [DataRequisicao, setDataRequisicao] = useState(new Date());
  const [DataConsulta, setDataConsulta] = useState(new Date());
  const [Local, setLocal] = useState('');
  const [Requisito, setRequisito] = useState('');
  const [fkId10, setFkId10] = useState('');
  const [fkId16, setFkId16] = useState('');
  const [showDataRequisicao, setShowDataRequisicao] = useState(false);
  const [showDataConsulta, setShowDataConsulta] = useState(false);

  // Médicos simulados
  const medicos = [
    { id: '1', nome: 'Dr. João Cardoso' },
    { id: '2', nome: 'Dra. Ana Paula' },
    { id: '3', nome: 'Dra. Adriano' },
    { id: '4', nome: 'Dra. José Luís' },
    { id: '5', nome: 'Dra. Maria Silva' },
    { id: 'outro', nome: 'Outro médico (não vinculado)' },
  ];

  const acompanhantes = [
    { id: '', nome: 'Nenhum' },
    { id: '1', nome: 'Joé Luís' },
    { id: '2', nome: 'Maria Raimunda' },
    { id: '3', nome: 'João Francisco' },
    { id: '4', nome: 'Eva Duailibe' },
    { id: '5', nome: 'Aristofani Mendonça' },
    { id: '6', nome: 'Ana Carla' },
  ];

  useEffect(() => {
    if (consulta) {
      setNome(consulta.Nome || '');
      setDataRequisicao(new Date(consulta.DataRequisicao));
      setDataConsulta(new Date(consulta.DataConsulta));
      setLocal(consulta.Local || '');
      setRequisito(consulta.Requisito || '');
      setFkId10(consulta.fkId10 || '');
      setFkId16(consulta.fkId16 || '');
    }
  }, [consulta]);

  const handleSalvar = () => {
    if (!Nome || !DataConsulta || !Local) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const consultaAtualizada = {
      ...consulta,
      Nome,
      DataRequisicao,
      DataConsulta,
      Local,
      Requisito,
      fkId10,
      fkId16,
    };

    onSave(consultaAtualizada);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="calendar-edit" size={24} color="#4caf50" />
              <Text style={styles.title}>Editar Consulta</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Edilson Carlos Silva Lima</Text>

          {/* Campos de edição */}
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={Nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Médico Requisitante</Text>
          <View style={styles.pickerContainer}>
            <Picker 
              selectedValue={fkId10} 
              onValueChange={setFkId10}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecione um médico..." value="" />
              {medicos.map(m => (
                <Picker.Item key={m.id} label={m.nome} value={m.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Data Requisição</Text>
          <TouchableOpacity style={styles.dateField} onPress={() => setShowDataRequisicao(true)}>
            <MaterialCommunityIcons name="calendar" size={20} color="#4caf50" />
            <Text style={styles.dateText}>{DataRequisicao.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDataRequisicao && (
            <DateTimePicker
              value={DataRequisicao}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDataRequisicao(false);
                if (date) setDataRequisicao(date);
              }}
            />
          )}

          <Text style={styles.label}>Data e Hora da Consulta</Text>
          <TouchableOpacity style={styles.dateField} onPress={() => setShowDataConsulta(true)}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color="#4caf50" />
            <Text style={styles.dateText}>{DataConsulta.toLocaleString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDataConsulta && (
            <DateTimePicker
              value={DataConsulta}
              mode="datetime"
              display="default"
              onChange={(_, date) => {
                setShowDataConsulta(false);
                if (date) setDataConsulta(date);
              }}
            />
          )}

          <Text style={styles.label}>Local</Text>
          <TextInput
            style={styles.input}
            value={Local}
            onChangeText={setLocal}
          />

          <Text style={styles.label}>Requisito</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={Requisito}
            onChangeText={setRequisito}
            multiline
          />

          <Text style={styles.label}>Acompanhante</Text>
          <View style={styles.pickerContainer}>
            <Picker 
              selectedValue={fkId16} 
              onValueChange={setFkId16}
              itemStyle={styles.pickerItem}
            >
              {acompanhantes.map(a => (
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
            <Text style={styles.cancelButtonText}>Voltar para Lista de Consultas</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
