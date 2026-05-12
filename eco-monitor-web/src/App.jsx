import { useState, useEffect } from 'react';
import Header           from './components/Header.jsx';
import MetricCard       from './components/MetricCard.jsx';
import CO2Card          from './components/CO2Card.jsx';
import PowerChart       from './components/PowerChart.jsx';
import VoltageCurrentChart from './components/VoltageCurrentChart.jsx';
import EnvironmentChart from './components/EnvironmentChart.jsx';
import DailySummary     from './components/DailySummary.jsx';
import HistoryView      from './components/HistoryView.jsx';
import { useReadings }  from './hooks/useReadings.js';
import { ALERTS, calcCO2 } from './utils/constants.js';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [view,  setView]  = useState('dashboard');
  const { readings, current, connected } = useReadings(60);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const co2Grams = calcCO2(current?.energy_wh ?? 0);

  return (
    <>
      <Header
        connected={connected}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        view={view}
        onViewChange={setView}
      />

      <main className="main-content">
        {view === 'dashboard' ? (
          <>
            <div className="metrics-grid">
              <MetricCard
                title="Voltaje"   value={current?.voltage?.toFixed(1)}
                unit="V"          icon="⚡"   color="blue"
                max={260}         current={current?.voltage ?? 0}
              />
              <MetricCard
                title="Corriente" value={current?.current_a?.toFixed(2)}
                unit="A"          icon="〰️"  color="amber"
                max={ALERTS.current * 2} current={current?.current_a ?? 0}
                alert={(current?.current_a ?? 0) > ALERTS.current}
              />
              <MetricCard
                title="Potencia"  value={current?.power_w?.toFixed(1)}
                unit="W"          icon="💡"   color="rose"
                max={ALERTS.power * 1.5} current={current?.power_w ?? 0}
                alert={(current?.power_w ?? 0) > ALERTS.power}
              />
              <MetricCard
                title="Energía"   value={current?.energy_wh?.toFixed(3)}
                unit="Wh"         icon="🔋"   color="green"
                max={1000}        current={current?.energy_wh ?? 0}
              />
              <MetricCard
                title="Temperatura" value={current?.temperature?.toFixed(1)}
                unit="°C"         icon="🌡️"  color="purple"
                max={50}          current={current?.temperature ?? 0}
                alert={(current?.temperature ?? 0) > ALERTS.temperature}
              />
              <MetricCard
                title="Humedad"   value={current?.humidity?.toFixed(1)}
                unit="%"          icon="💧"   color="blue"
                max={100}         current={current?.humidity ?? 0}
              />
            </div>

            <CO2Card co2Grams={co2Grams} energyWh={current?.energy_wh ?? 0} />
            <DailySummary />

            <div className="charts-grid">
              <PowerChart readings={readings} />
              <VoltageCurrentChart readings={readings} />
              <EnvironmentChart readings={readings} />
            </div>
          </>
        ) : (
          <HistoryView />
        )}
      </main>
    </>
  );
}
