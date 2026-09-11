// 📁 src/features/notifications/screens/NotificationScreen.js
//
// Inbox de notificações do paciente — GET /notifications/me (novo, ver
// REVISAO_POS_BACKEND.md §3 P.6). Inbox por polling (sem push nesta rodada).

import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import styles from '../styles/NotificationScreenStyles';
import {
  useNotifications,
  useMarkNotificationRead,
  useRemoveNotification,
} from '../../../hooks/useNotifications';
import { EmptyState, ErrorState, LoadingState } from '../../../components/feedback/StateViews';

const TYPE_ICON = {
  GERAL: 'bell',
  CONSULTA: 'calendar',
  EXAME: 'flask',
  VACINA: 'needle',
  MEDICACAO: 'pill',
  TRATAMENTO: 'hospital-box',
};

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data: items = [], isLoading, isError, error, refetch, isRefetching } =
    useNotifications({ unreadOnly });
  const markRead = useMarkNotificationRead();
  const removeNotif = useRemoveNotification();

  const renderItem = ({ item }) => (
    <View style={[styles.card, !item.read && styles.cardUnread]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name={TYPE_ICON[item.type] || 'bell'} size={18} color="#4caf50" />
        <Text style={styles.cardDate}>{item.createdAtLabel}</Text>
        {!item.read ? (
          <View style={styles.badgeNew}>
            <Text style={styles.badgeNewText}>NOVA</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardType}>{item.typeLabel}</Text>
      <Text style={styles.cardMessage}>{item.message}</Text>

      <View style={styles.actionsRow}>
        {!item.read ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => markRead.mutate(item.id)}
            disabled={markRead.isPending}
          >
            <MaterialCommunityIcons name="check" size={16} color="#2e7d32" />
            <Text style={[styles.actionText, { color: '#2e7d32' }]}>Marcar como lida</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => removeNotif.mutate(item.id)}
          disabled={removeNotif.isPending}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={16} color="#e53935" />
          <Text style={[styles.actionText, { color: '#e53935' }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="bell-alert" size={22} color="#2e7d32" />
          <Text style={styles.title}>Notificações</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: unreadOnly ? '#2e7d32' : '#e0e0e0' },
          ]}
          onPress={() => setUnreadOnly((v) => !v)}
        >
          <MaterialCommunityIcons
            name={unreadOnly ? 'email-mark-as-unread' : 'email-outline'}
            size={18}
            color={unreadOnly ? '#fff' : '#555'}
          />
          <Text style={[styles.filterButtonText, { color: unreadOnly ? '#fff' : '#555' }]}>
            {unreadOnly ? 'Mostrando só não lidas' : 'Mostrar só não lidas'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={
            items.length === 0 ? { flexGrow: 1 } : styles.container
          }
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="bell-outline"
              message={unreadOnly ? 'Nenhuma notificação não lida.' : 'Nenhuma notificação.'}
            />
          }
        />
      )}

      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}> Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
