import { useDailySummary } from '../hooks/useDailySummary.js';

export default function DailySummary() {
  const { summaries, loading } = useDailySummary(1);
  const s = summaries[0];

  const val = (v, dec = 2) => (v != null ? Number(v).toFixed(dec) : '—');

  return (
    <div className="daily-summary">
      <div className="section-title">Resumen del día anterior</div>
      {loading ? (
        <div className="daily-stats">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="daily-stat">
              <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 20, width: 100 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="daily-stats">
          <div className="daily-stat">
            <span className="daily-stat-label">Energía total</span>
            <span className="daily-stat-value" style={{ color: 'var(--green)' }}>
              {val(s?.total_energy_wh)} Wh
            </span>
          </div>
          <div className="daily-stat">
            <span className="daily-stat-label">Potencia máx / prom</span>
            <span className="daily-stat-value" style={{ color: 'var(--amber)' }}>
              {val(s?.max_power_w)} / {val(s?.avg_power_w)} W
            </span>
          </div>
          <div className="daily-stat">
            <span className="daily-stat-label">CO₂ emitido</span>
            <span className="daily-stat-value" style={{ color: 'var(--blue)' }}>
              {val(s?.co2_grams)} g CO₂e
            </span>
          </div>
          <div className="daily-stat">
            <span className="daily-stat-label">Alertas / Temp prom</span>
            <span className="daily-stat-value" style={{ color: s?.alert_count > 0 ? 'var(--rose)' : 'var(--text-2)' }}>
              {s?.alert_count ?? '—'} alertas · {val(s?.avg_temperature, 1)} °C
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
