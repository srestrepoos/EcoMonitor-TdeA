import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function fmt(iso) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function EnvironmentChart({ readings }) {
  const data = readings.map(r => ({
    t:    fmt(r.created_at),
    Temp: r.temperature != null ? +r.temperature.toFixed(1) : null,
    Hum:  r.humidity    != null ? +r.humidity.toFixed(1)    : null,
  }));

  return (
    <div className="chart-card">
      <div className="chart-title">Temperatura (°C) y Humedad (%)</div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--text-muted)' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="Temp" stroke="#8b5cf6" strokeWidth={2} fill="url(#gT)" dot={false} name="Temp (°C)" connectNulls />
          <Area type="monotone" dataKey="Hum"  stroke="#3b82f6" strokeWidth={2} fill="url(#gH)" dot={false} name="Humedad (%)" connectNulls />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
