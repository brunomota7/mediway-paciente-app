// src/features/cunsultations/components/ConsultationTabs

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tab, TabView } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/ConsultationTabsStyles';

/**
 * Componente de abas com lista de consultas filtradas por status
 * Usa FlashList para melhor performance e badges de status
 */
export default function ConsultationTabs({ consultas = [], onEdit }) {
  const [index, setIndex] = useState(0);

  // Filtragem das consultas por status
  const marcadas = consultas.filter(c => c.Status === 0 || c.Status === 3);
  const historico = consultas.filter(c => c.Status === 1 || c.Status === 2);

  // Função utilitária: converte status em texto + cor
  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return { texto: 'Marcado', cor: '#4caf50' };
      case 1:
        return { texto: 'Realizado', cor: '#2196f3' };
      case 2:
        return { texto: 'Cancelado', cor: '#9e9e9e' };
      case 3:
        return { texto: 'Remarcado', cor: '#ff9800' };
      default:
        return { texto: 'Indefinido', cor: '#bbb' };
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (data) => {
    if (!data) return '';
    const d = new Date(data);
    return `${d.toLocaleDateString('pt-BR')} – ${d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  const renderItem = (item) => {
    const statusInfo = getStatusInfo(item.Status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.Nome}</Text>
          <TouchableOpacity onPress={() => onEdit(item)}>
            <MaterialCommunityIcons name="pencil" size={20} color="#4caf50" />
          </TouchableOpacity>
        </View>

        {/* Badge de status */}
        <View style={styles.statusBadge(statusInfo.cor)}>
          <Text style={styles.statusText}>{statusInfo.texto}</Text>
        </View>

        <Text style={styles.subtitle}>Médico: {item.Medico || item.fkId16}</Text>
        <Text style={styles.text}>Solicitada em: {formatarData(item.DataRequisicao)}</Text>
        <Text style={styles.text}>Data: {formatarDataHora(item.DataConsulta)}</Text>
        <Text style={styles.text}>Local: {item.Local}</Text>
        {item.Requisito && <Text style={styles.text}>Requisitos: {item.Requisito}</Text>}
        {item.Status === 2 && item.DataCancelamento && (
          <Text style={styles.text}>Cancelada em: {formatarData(item.DataCancelamento)}</Text>
        )}
      </View>
    );
  };

  return (
    <>
      <Tab value={index} onChange={setIndex} indicatorStyle={styles.indicator} containerStyle={styles.tabContainer}>
        <Tab.Item
          title="Marcadas"
          icon={<MaterialCommunityIcons name="calendar-check" size={20} color={index === 0 ? '#4caf50' : '#aaa'} />}
          titleStyle={index === 0 ? styles.activeTabTitle : styles.inactiveTabTitle}
        />
        <Tab.Item
          title="Histórico"
          icon={<MaterialCommunityIcons name="calendar-remove" size={20} color={index === 1 ? '#4caf50' : '#aaa'} />}
          titleStyle={index === 1 ? styles.activeTabTitle : styles.inactiveTabTitle}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {/* 🔹 Abas de consultas marcadas */}
        <TabView.Item style={styles.tabView}>
          <FlashList
            data={marcadas}
            estimatedItemSize={140}
            keyExtractor={(item) => item.Id18.toString()}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma consulta marcada.</Text>}
          />
        </TabView.Item>

        {/* 🔹 Abas de histórico */}
        <TabView.Item style={styles.tabView}>
          <FlashList
            data={historico}
            estimatedItemSize={140}
            keyExtractor={(item) => item.Id18.toString()}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum histórico de consulta.</Text>}
          />
        </TabView.Item>
      </TabView>
    </>
  );
}
