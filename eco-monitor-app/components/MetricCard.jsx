import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const ACCENT = {
  green:  COLORS.green,
  blue:   COLORS.blue,
  amber:  COLORS.amber,
  rose:   COLORS.rose,
  purple: COLORS.purple,
};

export default function MetricCard({ title, value, unit, icon, color = 'green', max = 100, current = 0, alert = false }) {
  const accent = ACCENT[color] ?? COLORS.green;
  const pct    = Math.min((current / max) * 100, 100);

  return (
    <View style={[styles.shell, alert && styles.shellAlert]}>
      <View style={[styles.card, { borderTopColor: alert ? COLORS.rose : accent }]}>
        <View style={styles.header}>
          <Text style={styles.label}>{title}</Text>
          <View style={[styles.iconBox, { backgroundColor: `${accent}1a` }]}>
            <Text style={[styles.iconText, { color: accent }]}>{icon}</Text>
          </View>
        </View>

        <View style={styles.valueRow}>
          <Text style={[styles.value, alert && { color: COLORS.rose }]}>
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
          <View style={[
            styles.progressFill,
            { width: `${pct}%`, backgroundColor: alert ? COLORS.rose : accent },
          ]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  shellAlert: {
    borderColor: 'rgba(251,113,133,0.3)',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    gap: 6,
    borderTopWidth: 2,
    overflow: 'hidden',
  },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label:      { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.7 },
  iconBox:    { width: 27, height: 27, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  iconText:   { fontSize: 13 },
  valueRow:   { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  value:      { fontSize: 22, fontWeight: '500', color: COLORS.text, fontVariant: ['tabular-nums'], letterSpacing: -0.5 },
  unit:       { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  alertBadge: { backgroundColor: 'rgba(251,113,133,0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(251,113,133,0.2)' },
  alertText:  { fontSize: 10, color: COLORS.rose, fontWeight: '700' },
  progressBg: { height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
