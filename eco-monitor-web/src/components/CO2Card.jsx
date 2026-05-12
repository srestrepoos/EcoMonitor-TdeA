import { EMISSION_FACTOR } from '../utils/constants.js';

export default function CO2Card({ co2Grams, energyWh }) {
  const kgCO2 = (co2Grams / 1000).toFixed(4);
  const kWh   = (energyWh  / 1000).toFixed(4);

  return (
    <div className="co2-card">
      <div className="co2-main">
        <span className="co2-label">Huella de Carbono</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '.4rem' }}>
          <span className="co2-value mono">{co2Grams.toFixed(2)}</span>
          <span className="co2-unit">g CO₂e</span>
        </div>
        <span style={{ fontSize: '.72rem', color: 'rgba(167,243,208,.55)', marginTop: '.1rem' }}>
          Factor: {EMISSION_FACTOR} kg CO₂e/kWh · UPME 2024
        </span>
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
        <div className="co2-icon">🌿</div>
      </div>
    </div>
  );
}
