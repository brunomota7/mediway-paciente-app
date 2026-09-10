// 📁 src/features/consultations/components/ConsultationTabs.js
//
// Abas de consultas (somente leitura). Recebe a lista já adaptada por
// `consultationFromApi` e separa em "Marcadas" (MARCADO/REMARCADO) e "Histórico".

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tab, TabView } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Text, View } from 'react-native';
import styles from '../styles/ConsultationTabsStyles';
import { consultationExamStatusColor, isUpcomingStatus } from '../../../lib/statusColors';
import { toBrDate } from '../../../lib/datetime';

export default function ConsultationTabs({ consultas = [] }) {
  const [index, setIndex] = useState(0);

  const marcadas = consultas.filter((c) => isUpcomingStatus(c.status));
  const historico = consultas.filter((c) => !isUpcomingStatus(c.status));

  const renderItem = (item) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <View style={styles.statusBadge(consultationExamStatusColor(item.status))}>
        <Text style={styles.statusText}>{item.statusLabel}</Text>
      </View>

      {item.doctorName ? (
        <Text style={styles.subtitle}>Médico: {item.doctorName}</Text>
      ) : null}
      <Text style={styles.text}>
        Data: {toBrDate(item.date)}
        {item.time ? ` – ${item.time}` : ''}
      </Text>
      {item.local ? <Text style={styles.text}>Local: {item.local}</Text> : null}
      {item.description ? (
        <Text style={styles.text}>Descrição: {item.description}</Text>
      ) : null}
      {item.requirements ? (
        <Text style={styles.text}>Requisitos: {item.requirements}</Text>
      ) : null}
    </View>
  );

  return (
    <>
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={styles.indicator}
        containerStyle={styles.tabContainer}
      >
        <Tab.Item
          title={`Marcadas${marcadas.length ? ` (${marcadas.length})` : ''}`}
          icon={
            <MaterialCommunityIcons
              name="calendar-check"
              size={20}
              color={index === 0 ? '#4caf50' : '#aaa'}
            />
          }
          titleStyle={index === 0 ? styles.activeTabTitle : styles.inactiveTabTitle}
        />
        <Tab.Item
          title={`Histórico${historico.length ? ` (${historico.length})` : ''}`}
          icon={
            <MaterialCommunityIcons
              name="calendar-remove"
              size={20}
              color={index === 1 ? '#4caf50' : '#aaa'}
            />
          }
          titleStyle={index === 1 ? styles.activeTabTitle : styles.inactiveTabTitle}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={styles.tabView}>
          <FlashList
            data={marcadas}
            estimatedItemSize={140}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma consulta marcada.</Text>
            }
          />
        </TabView.Item>

        <TabView.Item style={styles.tabView}>
          <FlashList
            data={historico}
            estimatedItemSize={140}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum histórico de consulta.</Text>
            }
          />
        </TabView.Item>
      </TabView>
    </>
  );
}
