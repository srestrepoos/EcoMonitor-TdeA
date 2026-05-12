import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MetricCard        from '../../components/MetricCard';
import CO2Card           from '../../components/CO2Card';
import PowerChart        from '../../components/PowerChart';
import ConnectionStatus  from '../../components/ConnectionStatus';
import { useReadings }   from '../../hooks/useReadings';
import { ALERTS, COLORS, calcCO2 } from '../../utils/constants';

export default function Dashboard() {
  const { readings, current, connected } = useReadings(60);
  const co2Grams = calcCO2(current?.energy_wh ?? 0);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>EcoMonitor</Text>
            <Text style={styles.subtitle}>TdeA · RedCOLSI 2026</Text>
          </View>
          <ConnectionStatus connected={connected} />
        </View>

        {/* Etiqueta sección */}
        <Text style={styles.sectionLabel}>Monitoreo en tiempo real</Text>

        {/* Grid de métricas 2×3 */}
        <View style={styles.grid}>
          <View style={styles.row}>
            <MetricCard
              title="Voltaje"    value={current?.voltage?.toFixed(1)}       unit="V"
              icon="⚡"          color="blue"   max={260}
              current={current?.voltage   ?? 0}
            />
            <MetricCard
              title="Corriente"  value={current?.current_a?.toFixed(2)}     unit="A"
              icon="〰️"         color="amber"  max={ALERTS.current * 2}
              current={current?.current_a ?? 0}
              alert={(current?.current_a ?? 0) > ALERTS.current}
            />
          </View>
          <View style={styles.row}>
            <MetricCard
              title="Potencia"   value={current?.power_w?.toFixed(1)}       unit="W"
              icon="💡"          color="rose"   max={ALERTS.power * 1.5}
              current={current?.power_w  ?? 0}
              alert={(current?.power_w ?? 0) > ALERTS.power}
            />
            <MetricCard
              title="Energía"    value={current?.energy_wh?.toFixed(3)}     unit="Wh"
              icon="🔋"          color="green"  max={1000}
              current={current?.energy_wh ?? 0}
            />
          </View>
          <View style={styles.row}>
            <MetricCard
              title="Temperatura" value={current?.temperature?.toFixed(1)}  unit="°C"
              icon="🌡️"          color="purple" max={50}
              current={current?.temperature ?? 0}
              alert={(current?.temperature ?? 0) > ALERTS.temperature}
            />
            <MetricCard
              title="Humedad"    value={current?.humidity?.toFixed(1)}      unit="%"
              icon="💧"          color="blue"   max={100}
              current={current?.humidity ?? 0}
            />
          </View>
        </View>

        {/* CO₂ */}
        <CO2Card co2Grams={co2Grams} energyWh={current?.energy_wh ?? 0} />

        {/* Gráfico */}
        <Text style={styles.sectionLabel}>Potencia — últimas lecturas</Text>
        <PowerChart readings={readings} />

        {/* Timestamp */}
        {current && (
          <Text style={styles.timestamp}>
            Última lectura: {new Date(current.created_at).toLocaleString('es-CO')}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: COLORS.bg },
  scroll:       { flex: 1 },
  content:      { padding: 16, gap: 10, paddingBottom: 32 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  title:        { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: -0.6 },
  subtitle:     { fontSize: 11, color: COLORS.textMuted, marginTop: 1, letterSpacing: 0.3 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: -2 },
  grid:         { gap: 8 },
  row:          { flexDirection: 'row', gap: 8 },
  timestamp:    { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 6, letterSpacing: 0.2 },
});
