import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const ACCENT = {
  green:  COLORS.green,  blue: COLORS.blue,
  amber:  COLORS.amber,  rose: COLORS.rose,
  purple: COLORS.purple,
};

export default function MetricCard({ title, value, unit, icon, color = 'green', max = 100, current = 0, alert = false }) {
  const accent = ACCENT[color] ?? COLORS.green;
  const pct    = Math.min((current / max) * 100, 100);

  return (
    <View style={[styles.card, alert && styles.alertCard]}>
      <View style={styles.header}>
        <Text style={styles.label}>{title}</Text>
        <View style={[styles.iconBox, { backgroundColor: `${accent}22` }]}>
          <Text style={{ fontSize: 14 }}>{icon}</Text>
        </View>
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: alert ? COLORS.rose : COLORS.text }]}>
          {value ?? '—'}
        </Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      {alert && (
        <View style={styles.alertBadge}>
          <Text style={styles.alertText}>⚠ Alerta</Text>
        </View>
      )}

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, {
          width: `${pct}%`,
          backgroundColor: alert ? COLORS.rose : accent,
        }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: COLORS.card,
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
    gap: 6,
  },
  alertCard: { borderColor: 'rgba(244,63,94,.45)' },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label:     { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  iconBox:   { width: 28, height: 28, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  valueRow:  { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value:     { fontSize: 22, fontWeight: '500', fontVariant: ['tabular-nums'] },
  unit:      { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  alertBadge:{ backgroundColor: 'rgba(244,63,94,.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  alertText: { fontSize: 10, color: COLORS.rose, fontWeight: '600' },
  progressBg:{ height: 3, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
