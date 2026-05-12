import { EMISSION_FACTOR } from '../utils/constants.js';

export default function CO2Card({ co2Grams, energyWh }) {
  const kgCO2 = (co2Grams / 1000).toFixed(4);
  const kWh   = (energyWh  / 1000).toFixed(4);

  return (
    <div className="co2-card">
      <div className="co2-main">
        <span className="co2-label">Huella de Carbono</span>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span className="co2-value mono">{co2Grams.toFixed(2)}</span>
          <span className="co2-unit">g CO₂e</span>
        </div>
        <span className="co2-source">Factor: {EMISSION_FACTOR} kg CO₂e/kWh · UPME 2024</span>
      </div>

      <div className="co2-stat">
        <span className="co2-stat-label">Energía consumida</span>
        <span className="co2-stat-value mono">{kWh} kWh</span>
      </div>

      <div className="co2-stat">
        <span className="co2-stat-label">Equiv. en kg</span>
        <span className="co2-stat-value mono">{kgCO2} kg CO₂e</span>
      </div>

      <div className="co2-icon-area">
        <div className="co2-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(167,243,208,.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8C17 8 14 8 11 11s-3 9-3 9 4.5-1.5 7.5-4.5S17 8 17 8z"/>
            <path d="M3 21c1.5-3 3-5.5 6-7.5"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
