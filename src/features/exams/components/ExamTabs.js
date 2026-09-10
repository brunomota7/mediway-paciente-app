// 📁 src/features/exams/components/ExamTabs.js
//
// Abas de exames (somente leitura). Recebe a lista já adaptada por
// `examFromApi` e separa em "Marcados" (MARCADO/REMARCADO) e "Histórico".

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tab, TabView } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Text, View } from 'react-native';
import styles from '../styles/ExamTabsStyles';
import { consultationExamStatusColor, isUpcomingStatus } from '../../../lib/statusColors';
import { toBrDate } from '../../../lib/datetime';

export default function ExamTabs({ exames = [] }) {
  const [index, setIndex] = useState(0);

  const marcados = exames.filter((e) => isUpcomingStatus(e.status));
  const historico = exames.filter((e) => !isUpcomingStatus(e.status));

  const renderItem = (item) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <View style={styles.statusBadge(consultationExamStatusColor(item.status))}>
        <Text style={styles.statusText}>{item.statusLabel}</Text>
      </View>

      {item.requestDate ? (
        <Text style={styles.text}>Solicitado em: {toBrDate(item.requestDate)}</Text>
      ) : null}
      <Text style={styles.text}>
        Data: {toBrDate(item.date)}
        {item.time ? ` – ${item.time}` : ''}
      </Text>
      {item.local ? <Text style={styles.text}>Local: {item.local}</Text> : null}
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
          title={`Marcados${marcados.length ? ` (${marcados.length})` : ''}`}
          icon={
            <MaterialCommunityIcons
              name="flask-outline"
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
              name="history"
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
            data={marcados}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum exame marcado.</Text>}
            estimatedItemSize={160}
          />
        </TabView.Item>
        <TabView.Item style={styles.tabView}>
          <FlashList
            data={historico}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum exame no histórico.</Text>
            }
            estimatedItemSize={160}
          />
        </TabView.Item>
      </TabView>
    </>
  );
}
