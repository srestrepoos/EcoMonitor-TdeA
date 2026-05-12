export const EMISSION_FACTOR = 0.225; // kg CO₂e/kWh — UPME Resolución 1198/2024
export const calcCO2 = (energyWh) => (energyWh / 1000) * EMISSION_FACTOR * 1000;

export const ALERTS = { power: 300, current: 3, temperature: 35 };

export const COLORS = {
  bg:       '#0a0f1a',
  card:     '#111827',
  border:   '#1f2937',
  green:    '#10b981',
  blue:     '#3b82f6',
  amber:    '#f59e0b',
  rose:     '#f43f5e',
  purple:   '#8b5cf6',
  textMuted:'#6b7280',
  text:     '#f9fafb',
};
