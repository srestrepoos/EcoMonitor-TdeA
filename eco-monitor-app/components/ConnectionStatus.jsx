import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default function ConnectionStatus({ connected }) {
  return (
    <View style={[styles.badge, connected ? styles.online : styles.offline]}>
      <View style={[styles.dot, { backgroundColor: connected ? COLORS.green : COLORS.textMuted }]} />
      <Text style={[styles.text, { color: connected ? COLORS.green : COLORS.textMuted }]}>
        {connected ? 'ESP32 en vivo' : 'Desconectado'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 4, paddingHorizontal: 12,
    borderRadius: 99, borderWidth: 1,
  },
  online:  { borderColor: 'rgba(16,185,129,.35)', backgroundColor: 'rgba(16,185,129,.1)' },
  offline: { borderColor: COLORS.border, backgroundColor: 'transparent' },
  dot:  { width: 7, height: 7, borderRadius: 99 },
  text: { fontSize: 12, fontWeight: '500' },
});
