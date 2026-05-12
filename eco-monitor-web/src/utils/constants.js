// Factor de emisión Colombia — UPME Resolución 1198/2024 (datos 2023)
export const EMISSION_FACTOR = 0.225; // kg CO₂e/kWh

export const ALERTS = {
  power:       300,  // W
  current:     3,    // A
  temperature: 35,   // °C
};

export const LOCATION = 'Aula principal';

// co2Grams = (energyWh / 1000) * EMISSION_FACTOR * 1000
export const calcCO2 = (energyWh) => (energyWh / 1000) * EMISSION_FACTOR * 1000;
