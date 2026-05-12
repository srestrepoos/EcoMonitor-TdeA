import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function fmt(iso) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function VoltageCurrentChart({ readings }) {
  const data = readings.map(r => ({
    t: fmt(r.created_at),
    V: +(r.voltage   ?? 0).toFixed(1),
    A: +(r.current_a ?? 0).toFixed(2),
  }));

  return (
    <div className="chart-card">
      <div className="chart-title">Voltaje (V) y Corriente (A)</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
          <YAxis yAxisId="V" tick={{ fontSize: 10, fill: '#3b82f6' }} />
          <YAxis yAxisId="A" orientation="right" tick={{ fontSize: 10, fill: '#f59e0b' }} />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--text-muted)' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line yAxisId="V" type="monotone" dataKey="V" stroke="#3b82f6" strokeWidth={2} dot={false} name="Voltaje (V)" />
          <Line yAxisId="A" type="monotone" dataKey="A" stroke="#f59e0b" strokeWidth={2} dot={false} name="Corriente (A)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
