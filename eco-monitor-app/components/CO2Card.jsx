import { View, Text, StyleSheet } from 'react-native';
import { EMISSION_FACTOR } from '../utils/constants';

export default function CO2Card({ co2Grams, energyWh }) {
  const kWh   = (energyWh  / 1000).toFixed(4);
  const kgCO2 = (co2Grams  / 1000).toFixed(4);

  return (
    <View style={styles.shell}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.main}>
            <Text style={styles.label}>Huella de Carbono</Text>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{co2Grams.toFixed(2)}</Text>
              <Text style={styles.unit}> g CO₂e</Text>
            </View>
            <Text style={styles.factor}>Factor: {EMISSION_FACTOR} kg CO₂e/kWh · UPME 2024</Text>
          </View>
          <View style={styles.iconCircle}>
            <Text style={styles.leafIcon}>🌿</Text>
          </View>
        </View>

        <View style={styles.dividerLine} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Energía</Text>
            <Text style={styles.statValue}>{kWh} kWh</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Equiv. kg</Text>
            <Text style={styles.statValue}>{kgCO2} kg</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 18,
    padding: 2,
    backgroundColor: 'rgba(6,78,59,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  card: {
    borderRadius: 16,
    padding: 14,
    gap: 10,
    backgroundColor: '#053d2c',
    overflow: 'hidden',
  },
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  main:       { flex: 1, gap: 3 },
  label:      { fontSize: 10, fontWeight: '700', color: 'rgba(167,243,208,0.7)', textTransform: 'uppercase', letterSpacing: 0.8 },
  valueRow:   { flexDirection: 'row', alignItems: 'baseline' },
  value:      { fontSize: 28, fontWeight: '500', color: '#fff', fontVariant: ['tabular-nums'], letterSpacing: -0.8 },
  unit:       { fontSize: 14, color: 'rgba(167,243,208,0.75)' },
  factor:     { fontSize: 10, color: 'rgba(167,243,208,0.4)', marginTop: 1 },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)',
  },
  leafIcon:   { fontSize: 22 },
  dividerLine:{ height: 1, backgroundColor: 'rgba(16,185,129,0.15)' },
  statsRow:   { flexDirection: 'row', alignItems: 'center' },
  stat:       { flex: 1, gap: 2 },
  statLabel:  { fontSize: 10, color: 'rgba(167,243,208,0.55)', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue:  { fontSize: 13, fontWeight: '500', color: 'rgba(209,250,229,0.9)', fontVariant: ['tabular-nums'] },
  statDivider:{ width: 1, height: 28, backgroundColor: 'rgba(16,185,129,0.2)', marginHorizontal: 12 },
});
