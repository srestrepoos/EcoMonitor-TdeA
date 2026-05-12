import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { useDailySummary } from '../../hooks/useDailySummary';
import { COLORS } from '../../utils/constants';

const W = Dimensions.get('window').width - 32;

const v = (x, d = 2) => x != null ? Number(x).toFixed(d) : '—';

export default function History() {
  const { summaries, loading } = useDailySummary(30);

  const recent = summaries.slice(-14);
  const labels  = recent.map(s => s.date.slice(5));
  const energyData = recent.map(s => +(s.total_energy_wh ?? 0).toFixed(2));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Historial — últimos 30 días</Text>

        {/* Gráfico energía */}
        {energyData.length >= 2 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Energía diaria (Wh)</Text>
            <BarChart
              data={{ labels, datasets: [{ data: energyData }] }}
              width={W} height={200}
              chartConfig={{
                backgroundGradientFrom: COLORS.card,
                backgroundGradientTo:   COLORS.card,
                color: () => COLORS.green,
                labelColor: () => COLORS.textMuted,
                barPercentage: 0.6,
                propsForLabels: { fontSize: 8 },
              }}
              style={{ borderRadius: 8, marginLeft: -16 }}
              showValuesOnTopOfBars
            />
          </View>
        )}

        {/* Tabla */}
        <View style={styles.tableCard}>
          <Text style={styles.chartTitle}>Detalle por día</Text>
          {loading ? (
            <Text style={styles.empty}>Cargando…</Text>
          ) : summaries.length === 0 ? (
            <Text style={styles.empty}>Sin datos. Ejecuta summarize_daily() en Supabase.</Text>
          ) : (
            [...summaries].reverse().map(s => (
              <View key={s.id} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.dateText}>{s.date}</Text>
                </View>
                <View style={styles.tableStats}>
                  <Text style={styles.statItem}>
                    <Text style={{ color: COLORS.green }}>⚡ {v(s.total_energy_wh)} Wh</Text>
                  </Text>
                  <Text style={styles.statItem}>
                    <Text style={{ color: COLORS.purple }}>🌿 {v(s.co2_grams)} g CO₂</Text>
                  </Text>
                  <Text style={styles.statItem}>
                    <Text style={{ color: COLORS.amber }}>📈 Pmax {v(s.max_power_w)} W</Text>
                  </Text>
                  {s.alert_count > 0 && (
                    <Text style={[styles.statItem, { color: COLORS.rose }]}>
                      ⚠ {s.alert_count} alertas
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.bg },
  content:    { padding: 16, gap: 12, paddingBottom: 32 },
  heading:    { fontSize: 18, fontWeight: '700', color: COLORS.text },
  chartCard:  { backgroundColor: COLORS.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  chartTitle: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  tableCard:  { backgroundColor: COLORS.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border, gap: 4 },
  tableRow:   { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableCell:  { width: 90 },
  dateText:   { fontSize: 13, fontWeight: '600', color: COLORS.text },
  tableStats: { flex: 1, gap: 2 },
  statItem:   { fontSize: 12, color: COLORS.textMuted },
  empty:      { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 32 },
});
