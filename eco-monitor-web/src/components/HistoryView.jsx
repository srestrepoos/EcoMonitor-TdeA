import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../lib/supabase.js';

function isoToday()     { return new Date().toISOString().slice(0, 10); }
function iso30DaysAgo() {
  const d = new Date(); d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

const tooltipStyle = {
  contentStyle: { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 },
  labelStyle:   { color: 'var(--text-muted)' },
};

export default function HistoryView() {
  const [from,      setFrom]      = useState(iso30DaysAgo);
  const [to,        setTo]        = useState(isoToday);
  const [summaries, setSummaries] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('daily_summary')
        .select('*')
        .gte('date', from)
        .lte('date', to)
        .order('date', { ascending: true });
      setSummaries(data ?? []);
      setLoading(false);
    }
    load();
  }, [from, to]);

  const chartData = summaries.map(s => ({
    fecha:  s.date.slice(5),   // MM-DD
    Energía: +(s.total_energy_wh ?? 0).toFixed(2),
    CO2:     +(s.co2_grams       ?? 0).toFixed(2),
  }));

  const v = (x, d = 2) => x != null ? Number(x).toFixed(d) : '—';

  return (
    <div className="history-view">
      {/* Filtros */}
      <div className="history-filters">
        <label>Desde</label>
        <input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} />
        <label>Hasta</label>
        <input type="date" value={to}   min={from} max={isoToday()} onChange={e => setTo(e.target.value)} />
        <span style={{ marginLeft: 'auto', fontSize: '.78rem', color: 'var(--text-muted)' }}>
          {summaries.length} día{summaries.length !== 1 ? 's' : ''} con datos
        </span>
      </div>

      {/* Gráficos */}
      <div className="history-charts">
        <div className="chart-card">
          <div className="chart-title">Energía diaria (Wh)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip {...tooltipStyle} formatter={v => [`${v} Wh`, 'Energía']} />
              <Bar dataKey="Energía" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Huella de carbono diaria (g CO₂e)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip {...tooltipStyle} formatter={v => [`${v} g`, 'CO₂e']} />
              <Line type="monotone" dataKey="CO2" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div className="history-table-wrap">
        <div className="section-title" style={{ padding: '.85rem 1rem .25rem' }}>Detalle por día</div>
        {loading ? (
          <div className="empty-state"><div className="skeleton" style={{ height: 200, margin: '1rem' }} /></div>
        ) : summaries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            No hay datos para el rango seleccionado.<br />
            Recuerda ejecutar <code>SELECT summarize_daily();</code> en Supabase.
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Energía (Wh)</th>
                <th>P. Máx (W)</th>
                <th>P. Prom (W)</th>
                <th>CO₂ (g)</th>
                <th>Temp. prom</th>
                <th>Humedad</th>
                <th>Alertas</th>
              </tr>
            </thead>
            <tbody>
              {[...summaries].reverse().map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text)', fontWeight: 500 }}>{s.date}</td>
                  <td style={{ color: 'var(--green)' }}>{v(s.total_energy_wh)}</td>
                  <td>{v(s.max_power_w)}</td>
                  <td>{v(s.avg_power_w)}</td>
                  <td style={{ color: 'var(--purple)' }}>{v(s.co2_grams)}</td>
                  <td>{v(s.avg_temperature, 1)} °C</td>
                  <td>{v(s.avg_humidity, 1)} %</td>
                  <td style={{ color: s.alert_count > 0 ? 'var(--rose)' : 'inherit' }}>
                    {s.alert_count ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
