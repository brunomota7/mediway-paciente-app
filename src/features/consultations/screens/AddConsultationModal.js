// 📁 src/features/consultations/screens/AddConsultationModal.js

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
import styles from '../styles/AddConsultationModalStyles';

/**
 * Modal para Adicionar Nova Consulta do paciente
 * Padrão MVVM | Visual Mediway (branco, verde-menta, lavanda)
 */
export default function AddConsultationModal({ visible, onClose, onSave }) {
  const [Nome, setNome] = useState('');
  const [DataRequisicao, setDataRequisicao] = useState(new Date());
  const [DataConsultaData, setDataConsultaData] = useState(new Date());
  const [DataConsultaHora, setDataConsultaHora] = useState(new Date());
  const [Local, setLocal] = useState('');
  const [Requisito, setRequisito] = useState('');
  const [fkId03] = useState('123'); // ID do paciente (simulado)
  const [fkId10, setFkId10] = useState('');
  const [fkId16, setFkId16] = useState('');
  const [showDataRequisicao, setShowDataRequisicao] = useState(false);
  const [showDataConsultaData, setShowDataConsultaData] = useState(false);
  const [showDataConsultaHora, setShowDataConsultaHora] = useState(false);

  // Médicos simulados
  const medicos = [
    { id: '1', nome: 'Dr. João Cardoso' },
    { id: '2', nome: 'Dra. Ana Paula' },
    { id: '3', nome: 'Dra. Adriano' },
    { id: '4', nome: 'Dra. José Luís' },
    { id: '5', nome: 'Dra. Maria Silva' },
    { id: 'outro', nome: 'Outro médico (não vinculado)' },
  ];

  // Acompanhantes simulados
  const acompanhantes = [
    { id: '', nome: 'Nenhum' },
    { id: '1', nome: 'Joé Luís' },
    { id: '2', nome: 'Maria Raimunda' },
    { id: '3', nome: 'João Francisco' },
    { id: '4', nome: 'Eva Duailibe' },
    { id: '5', nome: 'Aristofani Mendonça' },
    { id: '6', nome: 'Ana Carla' },
  ];

  const handleSalvar = () => {
    if (!Nome || !DataConsultaData || !DataConsultaHora || !Local) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const dataCompletaConsulta = new Date(
      DataConsultaData.getFullYear(),
      DataConsultaData.getMonth(),
      DataConsultaData.getDate(),
      DataConsultaHora.getHours(),
      DataConsultaHora.getMinutes()
    );

    const novaConsulta = {
      Nome,
      DataRequisicao,
      DataConsulta: dataCompletaConsulta,
      Local,
      Requisito,
      Anotacoes: '',
      Status: 0,
      Situation: 1,
      fkId03,
      fkId10,
      fkId16,
    };

    onSave(novaConsulta);
    onClose();
    limpar();
  };

  const limpar = () => {
    setNome('');
    setLocal('');
    setRequisito('');
    setFkId10('');
    setFkId16('');
    setDataRequisicao(new Date());
    setDataConsultaData(new Date());
    setDataConsultaHora(new Date());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="calendar-plus" size={24} color="#4caf50" />
              <Text style={styles.title}>Adicionar Consulta</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Edilson Carlos Silva Lima</Text>

          {/* Campo Nome */}
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Motivo ou tipo de consulta"
            value={Nome}
            onChangeText={setNome}
          />

          {/* 👨‍⚕️ Médico requisitante */}
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

          {/* 📆 Data Requisição */}
          <Text style={styles.label}>Data Requisição:</Text>
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

          {/* 📅 Data da Consulta */}
          <Text style={styles.label}>Data da Consulta:</Text>
          <TouchableOpacity style={styles.dateField} onPress={() => setShowDataConsultaData(true)}>
            <MaterialCommunityIcons name="calendar" size={20} color="#4caf50" />
            <Text style={styles.dateText}>{DataConsultaData.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDataConsultaData && (
            <DateTimePicker
              value={DataConsultaData}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDataConsultaData(false);
                if (date) setDataConsultaData(date);
              }}
            />
          )}

          {/* ⏰ Hora da Consulta */}
          <Text style={styles.label}>Hora da Consulta:</Text>
          <TouchableOpacity style={styles.dateField} onPress={() => setShowDataConsultaHora(true)}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#4caf50" />
            <Text style={styles.dateText}>
              {DataConsultaHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showDataConsultaHora && (
            <DateTimePicker
              value={DataConsultaHora}
              mode="time"
              display="default"
              onChange={(_, date) => {
                setShowDataConsultaHora(false);
                if (date) setDataConsultaHora(date);
              }}
            />
          )}


          {/* 📍 Local */}
          <Text style={styles.label}>Local:</Text>
          <TextInput
            style={styles.input}
            placeholder="Local da consulta"
            value={Local}
            onChangeText={setLocal}
          />

          {/* 📑 Requisitos */}
          <Text style={styles.label}>Requisito:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Orientações ou observações"
            value={Requisito}
            onChangeText={setRequisito}
            multiline
          />

          {/* Acompanhante */}
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
