import { View, Text, StyleSheet } from 'react-native';
import { EMISSION_FACTOR } from '../utils/constants';

export default function CO2Card({ co2Grams, energyWh }) {
  const kWh   = (energyWh  / 1000).toFixed(4);
  const kgCO2 = (co2Grams  / 1000).toFixed(4);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={styles.label}>Huella de Carbono</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{co2Grams.toFixed(2)}</Text>
            <Text style={styles.unit}> g CO₂e</Text>
          </View>
          <Text style={styles.factor}>Factor: {EMISSION_FACTOR} kg CO₂e/kWh · UPME 2024</Text>
        </View>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 26 }}>🌿</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Energía</Text>
          <Text style={styles.statValue}>{kWh} kWh</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Equiv. kg</Text>
          <Text style={styles.statValue}>{kgCO2} kg</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12, padding: 14, gap: 10,
    backgroundColor: '#065f46',
    borderWidth: 1, borderColor: 'rgba(16,185,129,.25)',
  },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  main:      { flex: 1, gap: 3 },
  label:     { fontSize: 10, fontWeight: '600', color: 'rgba(167,243,208,.75)', textTransform: 'uppercase', letterSpacing: 0.6 },
  valueRow:  { flexDirection: 'row', alignItems: 'baseline' },
  value:     { fontSize: 28, fontWeight: '500', color: '#fff', fontVariant: ['tabular-nums'] },
  unit:      { fontSize: 14, color: 'rgba(167,243,208,.8)' },
  factor:    { fontSize: 10, color: 'rgba(167,243,208,.5)' },
  iconCircle:{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(16,185,129,.2)', justifyContent: 'center', alignItems: 'center' },
  stats:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stat:      { flex: 1, gap: 2 },
  statLabel: { fontSize: 10, color: 'rgba(167,243,208,.6)', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 13, fontWeight: '500', color: 'rgba(209,250,229,.9)', fontVariant: ['tabular-nums'] },
  divider:   { width: 1, height: 28, backgroundColor: 'rgba(16,185,129,.25)' },
});
