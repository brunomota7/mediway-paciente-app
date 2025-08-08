// 📁 src/features/medications/components/MedicationTabs.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tab, TabView } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/MedicationTabsStyles';

/**
 * Componente com abas para medicamentos Ativos e Suspensos
 * Usa FlashList para melhor performance
 */
export default function MedicationTabs({ medicamentos = [], onEdit }) {
  const [index, setIndex] = useState(0);

  const ativos = medicamentos.filter(m => m.Situacao === 0);
  const suspensos = medicamentos.filter(m => m.Situacao !== 0);

  const getSituacaoInfo = (status) => {
    switch (status) {
      case 0: return { texto: 'Ativo', cor: '#4caf50' };
      case 1: return { texto: 'Suspenso', cor: '#9e9e9e' };
      case 2: return { texto: 'Não faz mais uso', cor: '#ff9800' };
      default: return { texto: 'Indefinido', cor: '#bbb' };
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const renderCard = (item) => {
    const situacaoInfo = getSituacaoInfo(item.Situacao);

    return (
      <View style={styles.card} key={item.Id11}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.Nome}</Text>
          <TouchableOpacity onPress={() => onEdit(item)}>
            <MaterialCommunityIcons name="pencil" size={20} color="#4caf50" />
          </TouchableOpacity>
        </View>

        {/* Badge de status */}
        <View style={[styles.statusBadge, { backgroundColor: situacaoInfo.cor }]}>
          <Text style={styles.statusText}>{situacaoInfo.texto}</Text>
        </View>

        <Text style={styles.subTitle}>Tipo: {item.Tipo}</Text>
        {item.NomeReferencia ? (
          <Text style={styles.refText}>Referência: {item.NomeReferencia}</Text>
        ) : null}
        <Text style={styles.text}>Descrição: {item.Descricao}</Text>
        <Text style={styles.text}>Concentração: {item.Concentracao}</Text>
        <Text style={styles.text}>Quantidade: {item.Quantidade}</Text>
        <Text style={styles.text}>Dias: {item.Dias}</Text>
        <Text style={styles.text}>Horários: {item.Horarios}</Text>
        <Text style={styles.text}>Gaveta: {item.Gaveta}</Text>
        <Text style={styles.text}>Estoque: {item.Estoque}</Text>

        {/* Suspensão */}
{/*         {item.Situacao !== 0 && item.DataSuspensao && (
          <View style={styles.suspBox}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#e57373" />
            <Text style={styles.suspText}>Suspenso em: {formatarData(item.DataSuspensao)}</Text>
            <TouchableOpacity>
              <Text style={styles.link}>Ver histórico</Text>
            </TouchableOpacity>
          </View>
        )} */}
        {(item.Situacao !== 0 && item.DataSuspensao) ? (
          <View style={styles.suspBox}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#e57373" />
            <Text style={styles.suspText}>Suspenso em: {formatarData(item.DataSuspensao)}</Text>
            <TouchableOpacity>
              <Text style={styles.link}>Ver histórico</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.histBox}>
            <MaterialCommunityIcons name="history" size={20} color="#4caf50" />
            <Text style={styles.histText}>Medicamento ativo</Text> 
            <TouchableOpacity>
              <Text style={styles.link}>Ver histórico</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      
      {/* Abas de navegação */}
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={styles.indicator}
        containerStyle={styles.tabContainer}
      >
        <Tab.Item
          title="Ativos"
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
          title="Suspensos"
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

      {/* Conteúdo das abas */}
      <TabView value={index} onChange={setIndex} animationType="spring">
        {/* Aba: Ativos */}
        <TabView.Item style={{ flex: 1 }}>
          <FlashList
            data={ativos}
            renderItem={({ item }) => renderCard(item)}
            keyExtractor={(item) => item.Id11.toString()}
            estimatedItemSize={250}
          />
        </TabView.Item>

        {/* Aba: Suspensos */}
        <TabView.Item style={{ flex: 1 }}>
          <FlashList
            data={suspensos}
            renderItem={({ item }) => renderCard(item)}
            keyExtractor={(item) => item.Id11.toString()}
            estimatedItemSize={250}
            contentContainerStyle={{ padding: 16 }}
          />
        </TabView.Item>
      </TabView>

    </>
  );
}