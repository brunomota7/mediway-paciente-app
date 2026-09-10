// 📁 src/components/feedback/NetworkBanner.js
//
// Faixa fixa no topo quando a última chamada ao backend falhou por rede/timeout.

import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useServerUnreachable } from '../../api/networkStatus';

export default function NetworkBanner() {
  const down = useServerUnreachable();
  const insets = useSafeAreaInsets();
  if (!down) return null;
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
      <MaterialCommunityIcons name="wifi-off" size={16} color="#fff" />
      <Text style={styles.text}>Sem conexão com o servidor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#b71c1c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 6,
    paddingHorizontal: 12,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
