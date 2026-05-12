const LeafIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2C13 2 10 2 7 5s-3 7-3 7 3.5-1 6-3.5S13 2 13 2z"/>
    <path d="M3 13c1-2 2-4 4-5.5"/>
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="8" r="3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M13.5 10A6 6 0 0 1 6 2.5 6.5 6.5 0 1 0 13.5 10z"/>
  </svg>
);

export default function Header({ connected, theme, onToggleTheme, view, onViewChange }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <LeafIcon />
        </div>
        <div>
          <div className="header-title">EcoMonitor</div>
          <div className="header-subtitle">TdeA · RedCOLSI 2026</div>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-tab ${view === 'history' ? 'active' : ''}`}
          onClick={() => onViewChange('history')}
        >
          Historial
        </button>
      </nav>

      <div className="header-right">
        <div className={`connection-badge ${connected ? 'online' : 'offline'}`}>
          <span className={`connection-dot ${connected ? 'pulse' : ''}`} />
          {connected ? 'En vivo' : 'Sin conexión'}
        </div>
        <button className="theme-btn" onClick={onToggleTheme} title="Cambiar tema">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
