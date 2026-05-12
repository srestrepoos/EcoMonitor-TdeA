import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, ALERTS, EMISSION_FACTOR } from '../../utils/constants';

function InfoRow({ label, value, accent }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, accent && { color: accent }]}>{value}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function Settings() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Ajustes e Información</Text>

        <Section title="Umbrales de alerta">
          <InfoRow label="Potencia máxima"    value={`${ALERTS.power} W`}       accent={COLORS.rose}   />
          <InfoRow label="Corriente máxima"   value={`${ALERTS.current} A`}     accent={COLORS.amber}  />
          <InfoRow label="Temperatura máxima" value={`${ALERTS.temperature} °C`} accent={COLORS.purple} />
        </Section>

        <Section title="Factor de emisión">
          <InfoRow label="Factor CO₂e"   value={`${EMISSION_FACTOR} kg CO₂e/kWh`} accent={COLORS.green} />
          <InfoRow label="Fuente"        value="UPME Resolución 1198/2024" />
          <InfoRow label="Datos de año"  value="2023" />
          <InfoRow label="País"          value="Colombia" />
        </Section>

        <Section title="Sensores (ESP32)">
          <InfoRow label="Voltaje AC"    value="ZMPT101B" />
          <InfoRow label="Corriente AC"  value="SCT-013 50A/1V" />
          <InfoRow label="Temp/Humedad" value="DHT11" />
          <InfoRow label="Frecuencia"   value="Cada 5 segundos" />
          <InfoRow label="Ubicación"    value="Aula principal" />
        </Section>

        <Section title="Base de datos">
          <InfoRow label="Proveedor"    value="Supabase (PostgreSQL)" />
          <InfoRow label="Región"       value="East US (North Virginia)" />
          <InfoRow label="Realtime"     value="Habilitado (postgres_changes)" />
          <InfoRow label="Retención"    value="30 días" />
        </Section>

        <Section title="Proyecto">
          <InfoRow label="Nombre"       value="EcoMonitor TdeA" />
          <InfoRow label="Institución"  value="Tecnológico de Antioquia" />
          <InfoRow label="Semillero"    value="Ágil Project Semillero" />
          <InfoRow label="Evento"       value="RedCOLSI 2026" />
          <InfoRow label="Versión app"  value="1.0.0" />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: COLORS.bg },
  content:      { padding: 16, gap: 16, paddingBottom: 32 },
  heading:      { fontSize: 18, fontWeight: '700', color: COLORS.text },
  section:      { gap: 6 },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, paddingLeft: 4 },
  sectionCard:  { backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  row:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel:     { fontSize: 13, color: COLORS.text, flex: 1 },
  rowValue:     { fontSize: 13, color: COLORS.textMuted, fontWeight: '500', textAlign: 'right', flex: 1 },
});
