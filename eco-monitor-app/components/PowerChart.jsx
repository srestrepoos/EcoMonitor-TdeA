import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../utils/constants';

const W = Dimensions.get('window').width - 32;

export default function PowerChart({ readings }) {
  const recent = readings.slice(-20);
  const labels  = recent.map((_, i) => i % 5 === 0 ? `${i * 5}s` : '');
  const dataset = recent.map(r => +(r.power_w ?? 0).toFixed(1));

  if (dataset.length < 2) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Potencia en tiempo real (W)</Text>
        <Text style={styles.empty}>Esperando datos del ESP32…</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Potencia en tiempo real (W)</Text>
      <LineChart
        data={{ labels, datasets: [{ data: dataset }] }}
        width={W} height={160}
        withDots={false}
        withInnerLines={false}
        chartConfig={{
          backgroundGradientFrom: COLORS.card,
          backgroundGradientTo:   COLORS.card,
          color: () => COLORS.rose,
          labelColor: () => COLORS.textMuted,
          strokeWidth: 2,
          propsForLabels: { fontSize: 9 },
        }}
        bezier
        style={{ borderRadius: 8, marginLeft: -12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card:  { backgroundColor: COLORS.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  empty: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 40 },
});
