// 📁 src/components/feedback/StateViews.js
//
// Estados de tela padronizados (loading / erro / vazio) usados pelas listas.

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function LoadingState({ label }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#2e7d32" />
      {label ? <Text style={styles.muted}>{label}</Text> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.centered}>
      <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#e53935" />
      <Text style={styles.errorText}>
        {message || 'Não foi possível carregar os dados.'}
      </Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function EmptyState({ icon = 'inbox-outline', message }) {
  return (
    <View style={styles.centered}>
      <MaterialCommunityIcons name={icon} size={44} color="#c8e6c9" />
      <Text style={styles.muted}>{message || 'Nada por aqui ainda.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  muted: {
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default { LoadingState, ErrorState, EmptyState };
