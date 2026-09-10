// 📁 src/features/medications/components/MedicationTabs.js
//
// Abas Ativos / Suspensos. Recebe a lista já adaptada por `medicationFromApi`.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tab, TabView } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/MedicationTabsStyles';

const STATUS_COLOR = { ATIVO: '#4caf50', SUSPENSO: '#9e9e9e' };

export default function MedicationTabs({ medicamentos = [], onEdit }) {
  const [index, setIndex] = useState(0);

  const ativos = medicamentos.filter((m) => m.status === 'ATIVO');
  const suspensos = medicamentos.filter((m) => m.status !== 'ATIVO');

  const renderCard = (item) => (
    <View style={styles.card} key={item.id}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.nome}</Text>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <MaterialCommunityIcons name="cog-outline" size={20} color="#4caf50" />
        </TouchableOpacity>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] ?? '#bbb' }]}>
        <Text style={styles.statusText}>{item.statusLabel}</Text>
      </View>

      {item.tipoLabel ? <Text style={styles.subTitle}>Tipo: {item.tipoLabel}</Text> : null}
      {item.nomeReferencia ? (
        <Text style={styles.refText}>Referência: {item.nomeReferencia}</Text>
      ) : null}
      {item.descricao ? <Text style={styles.text}>Descrição: {item.descricao}</Text> : null}
      {item.concentracao ? (
        <Text style={styles.text}>Concentração: {item.concentracao}</Text>
      ) : null}
      {item.quantidade ? <Text style={styles.text}>Quantidade: {item.quantidade}</Text> : null}
      {item.diasLabel ? <Text style={styles.text}>Dias: {item.diasLabel}</Text> : null}
      {item.hora ? <Text style={styles.text}>Horário: {item.hora}</Text> : null}
      {item.gaveta ? <Text style={styles.text}>Gaveta: {item.gaveta}</Text> : null}
      <Text style={styles.text}>Estoque: {item.estoque}</Text>
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
          title={`Ativos${ativos.length ? ` (${ativos.length})` : ''}`}
          icon={
            <MaterialCommunityIcons
              name="pill"
              size={20}
              color={index === 0 ? '#4caf50' : '#aaa'}
            />
          }
          titleStyle={index === 0 ? styles.activeTab : styles.inactiveTab}
        />
        <Tab.Item
          title={`Suspensos${suspensos.length ? ` (${suspensos.length})` : ''}`}
          icon={
            <MaterialCommunityIcons
              name="minus-circle-outline"
              size={20}
              color={index === 1 ? '#e57373' : '#aaa'}
            />
          }
          titleStyle={index === 1 ? styles.activeTab : styles.inactiveTab}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ flex: 1 }}>
          <FlashList
            data={ativos}
            renderItem={({ item }) => renderCard(item)}
            keyExtractor={(item) => String(item.id)}
            estimatedItemSize={220}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
                Nenhum medicamento ativo.
              </Text>
            }
          />
        </TabView.Item>
        <TabView.Item style={{ flex: 1 }}>
          <FlashList
            data={suspensos}
            renderItem={({ item }) => renderCard(item)}
            keyExtractor={(item) => String(item.id)}
            estimatedItemSize={220}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
                Nenhum medicamento suspenso.
              </Text>
            }
          />
        </TabView.Item>
      </TabView>
    </>
  );
}
