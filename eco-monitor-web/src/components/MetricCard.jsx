const COLOR_MAP = {
  green:  { accent: 'var(--green)',  bg: 'var(--green-bg)'  },
  blue:   { accent: 'var(--blue)',   bg: 'var(--blue-bg)'   },
  amber:  { accent: 'var(--amber)',  bg: 'var(--amber-bg)'  },
  rose:   { accent: 'var(--rose)',   bg: 'var(--rose-bg)'   },
  purple: { accent: 'var(--purple)', bg: 'var(--purple-bg)' },
};

const ICONS = {
  '⚡': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 1.5 4 8.5h4l-1.5 6 6-8h-4l1-5z"/>
    </svg>
  ),
  '〰️': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 8c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0"/>
    </svg>
  ),
  '💡': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1a4.5 4.5 0 0 1 3 7.9V11H5V8.9A4.5 4.5 0 0 1 8 1z"/>
      <path d="M5.5 11h5M6 13.5h4"/>
    </svg>
  ),
  '🔋': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4.5" width="12" height="7" rx="1.5"/>
      <path d="M13 7v2" strokeWidth="2.5"/>
    </svg>
  ),
  '🌡️': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 1v8.27a3 3 0 1 0 2 0V1a1 1 0 0 0-2 0z"/>
    </svg>
  ),
  '💧': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2 C8 2, 3 7.5, 3 10.5a5 5 0 0 0 10 0C13 7.5 8 2 8 2z"/>
    </svg>
  ),
};

export default function MetricCard({ title, value, unit, icon, color = 'green', max = 100, current = 0, alert = false }) {
  const { accent, bg } = COLOR_MAP[color] ?? COLOR_MAP.green;
  const pct = Math.min((current / max) * 100, 100);
  const SvgIcon = ICONS[icon];

  return (
    <div
      className={`metric-card-shell ${alert ? 'alert' : ''}`}
    >
      <div
        className="metric-card"
        style={{ '--accent-color': accent, '--icon-bg': bg }}
      >
        <div className="metric-header">
          <span className="metric-label">{title}</span>
          <span
            className="metric-icon"
            style={{ color: accent }}
          >
            {SvgIcon ?? icon}
          </span>
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
    </div>
  );
}
