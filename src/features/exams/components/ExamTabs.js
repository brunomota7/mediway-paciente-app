// src/features/exams/components/ExamTabs.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tab, TabView } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/ExamTabsStyles';

/**
 * Componente de abas para exibir exames por status
 * - Marcados (Situação 0 e 3)
 * - Realizados ou Cancelados (Situação 1 e 2)
 */
export default function ExamTabs({ exames = [], onEdit }) {
  const [index, setIndex] = useState(0);

  const marcados = exames.filter(e => e.Situacao === 0 || e.Situacao === 3);
  const historico = exames.filter(e => e.Situacao === 1 || e.Situacao === 2);

  // Função utilitária: converte status em texto + cor
  const getSituacao = (situacao) => {
    switch (situacao) {
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

  const formatarHora = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = (item) => {
    const situacao = getSituacao(item.Situacao);
    
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.Nome}</Text>
                <TouchableOpacity onPress={() => onEdit(item)}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#4caf50" />
                </TouchableOpacity>
            </View>

            {/* Badge de status */}
            <View style={styles.statusBadge(situacao.cor)}>
                <Text style={styles.statusText}>{situacao.texto}</Text>
            </View>

            <Text style={styles.subtitle}>Médico: {item.Medico || item.fkId16}</Text>
            <Text style={styles.text}>Solicitado em: {formatarData(item.DataSolicitacao)}</Text>
            <Text style={styles.text}>Data Agendada: {formatarData(item.DataExameData)}</Text>
            <Text style={styles.text}>Hora Agendada: {formatarHora(item.DataExameHora)}</Text>
            <Text style={styles.text}>Local: {item.Local}</Text>
            {item.Requisito && <Text style={styles.text}>Requisitos: {item.Requisito}</Text>}
            {item.Situacao === 2 && item.DataCancelamento && (
                <Text style={styles.text}>Cancelado em: {formatarData(item.DataCancelamento)}</Text>
            )}
        </View>
    );
  };

  return (
    <>
      <Tab value={index} onChange={setIndex} indicatorStyle={styles.indicator} containerStyle={styles.tabContainer}>
        <Tab.Item
          title="Marcados"
          icon={<MaterialCommunityIcons name="flask-outline" size={20} color={index === 0 ? '#4caf50' : '#aaa'} />}
          titleStyle={index === 0 ? styles.activeTabTitle : styles.inactiveTabTitle}
        />
        <Tab.Item
          title="Histórico"
          icon={<MaterialCommunityIcons name="history" size={20} color={index === 1 ? '#4caf50' : '#aaa'} />}
          titleStyle={index === 1 ? styles.activeTabTitle : styles.inactiveTabTitle}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {/* Abas */}
        <TabView.Item style={styles.tabView}>
          <FlashList
            data={marcados}
            keyExtractor={(item) => item.Id19.toString()}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum exame marcado.</Text>}
            estimatedItemSize={180}
          />
        </TabView.Item>
        <TabView.Item style={styles.tabView}>
          <FlashList
            data={historico}
            keyExtractor={(item) => item.Id19.toString()}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum exame realizado ou cancelado.</Text>}
            estimatedItemSize={180}
          />
        </TabView.Item>
      </TabView>
    </>
  );
}
