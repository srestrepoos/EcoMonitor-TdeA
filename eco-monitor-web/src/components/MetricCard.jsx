const COLOR_MAP = {
  green:  { accent: 'var(--green)',  bg: 'var(--green-bg)'  },
  blue:   { accent: 'var(--blue)',   bg: 'var(--blue-bg)'   },
  amber:  { accent: 'var(--amber)',  bg: 'var(--amber-bg)'  },
  rose:   { accent: 'var(--rose)',   bg: 'var(--rose-bg)'   },
  purple: { accent: 'var(--purple)', bg: 'var(--purple-bg)' },
};

export default function MetricCard({ title, value, unit, icon, color = 'green', max = 100, current = 0, alert = false }) {
  const { accent, bg } = COLOR_MAP[color] ?? COLOR_MAP.green;
  const pct = Math.min((current / max) * 100, 100);

  return (
    <div
      className={`metric-card ${alert ? 'alert' : ''}`}
      style={{ '--accent-color': accent, '--icon-bg': bg }}
    >
      <div className="metric-header">
        <span className="metric-label">{title}</span>
        <span className="metric-icon">{icon}</span>
      </div>

      <div className="metric-value-row">
        <span className="metric-value mono">{value ?? '—'}</span>
        <span className="metric-unit">{unit}</span>
      </div>

      {alert && (
        <div className="metric-alert-badge">⚠ Alerta</div>
      )}

      <div className="progress-bar">
        <div
          className={`progress-fill ${alert ? 'alert' : ''}`}
          style={{ width: `${pct}%`, background: alert ? undefined : accent }}
        />
      </div>
    </div>
  );
}
