export default function Header({ connected, theme, onToggleTheme, view, onViewChange }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">E</div>
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
          {connected ? 'En vivo' : 'Desconectado'}
        </div>
        <button className="theme-btn" onClick={onToggleTheme} title="Cambiar tema">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
