import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function fmt(iso) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function PowerChart({ readings }) {
  const data = readings.map(r => ({ t: fmt(r.created_at), P: +(r.power_w ?? 0).toFixed(2) }));

  return (
    <div className="chart-card">
      <div className="chart-title">Potencia en tiempo real (W)</div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--text-muted)' }}
            formatter={v => [`${v} W`, 'Potencia']}
          />
          <Area type="monotone" dataKey="P" stroke="#f43f5e" strokeWidth={2} fill="url(#gP)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
