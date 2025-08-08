// src/features/notifications/screens/NotificationScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/NotificationScreenStyles';

/**
 * Tela de exibição de notificações sobre medicamentos não tomados pelo paciente
 * Implementa o padrão MVVM com estados controlados e layout limpo baseado em cards
 */
export default function NotificationScreen({ navigation }) {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)); // 90 dias atrás
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const mockData = [
    {
      id: '1',
      dataNotificacao: '12/05/2024 08:00',
      prescricao: '12/05/2024 às 08:00',
      medicamento: 'Enalapril',
      tratamento: 'Hipertensão Crônica',
    },
    {
      id: '2',
      dataNotificacao: '15/06/2024 14:00',
      prescricao: '15/06/2024 às 14:00',
      medicamento: 'Metformina',
      tratamento: 'Diabetes Tipo 2',
    },
    {
      id: '3',
      dataNotificacao: '22/06/2024 07:30',
      prescricao: '22/06/2024 às 07:30',
      medicamento: 'Atorvastatina',
      tratamento: 'Colesterol Alto',
    },
    {
      id: '4',
      dataNotificacao: '03/07/2024 09:00',
      prescricao: '03/07/2024 às 09:00',
      medicamento: 'AAS Infantil',
      tratamento: 'Prevenção Cardiovascular',
    },
    {
      id: '5',
      dataNotificacao: '08/07/2024 18:00',
      prescricao: '08/07/2024 às 18:00',
      medicamento: 'Losartana',
      tratamento: 'Hipertensão Leve',
    },
  ];

  const handleConsultar = () => {
    // Em uma aplicação real, aqui faria chamada à API com intervalo
    setNotifications(mockData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="bell-alert" size={28} color="#4caf50" />
        <Text style={styles.title}>Notificações: Não Cumpriu Prescrições Médicas</Text>
      </View>

      {/* Nome do paciente */}
      <Text style={styles.patientName}>Edilson Carlos Silva Lima</Text>

      {/* Filtros por data */}
      <View style={styles.filterGroup}>
        <Text style={styles.label}>Data Início:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate.toLocaleDateString('pt-BR')}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <Text style={styles.label}>Data Fim:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{endDate.toLocaleDateString('pt-BR')}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.consultButton} onPress={handleConsultar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
          <Text style={styles.consultButtonText}>Consultar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de notificações */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="red" />
              <Text style={styles.cardDate}>{item.dataNotificacao}</Text>
            </View>
            <Text style={styles.cardTitle}>Tratamento: {item.tratamento}</Text>
            <Text style={styles.cardSubtitle}>Medicamento: {item.medicamento}</Text>
            <Text style={styles.cardInfo}>Prescrição: {item.prescricao}</Text>
            <Text style={styles.cardWarning}>Status: Dose não registrada</Text>
          </View>
        )}
      />

      {/* Botão de saída */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="exit-to-app" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
