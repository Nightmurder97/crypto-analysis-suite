// src/utils/colorUtils.ts

export type HeatmapMetricType =
  | 'price_change_percentage_1h_in_currency'
  | 'price_change_percentage_24h'
  | 'price_change_percentage_7d_in_currency'
  | 'price_change_percentage_30d_in_currency'
  | 'market_cap'
  | 'total_volume'
  | 'current_price'
  | string; // Allow other string keys

const interpolateColor = (color1: [number, number, number], color2: [number, number, number], factor: number): string => {
  const r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
  const g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
  const b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
  return `rgb(${r},${g},${b})`;
};

// Paleta Rojo-Amarillo-Verde
const RED_STRONG = [215, 25, 28] as [number, number, number];      // Rojo intenso
const YELLOW_NEUTRAL = [255, 255, 191] as [number, number, number]; // Amarillo (neutral)
const GREEN_STRONG = [26, 150, 65] as [number, number, number];    // Verde intenso

// Paleta Azul para valores absolutos (ej. market cap, volumen)
const BLUE_LIGHT = [222, 235, 247] as [number, number, number]; // Ligero
const BLUE_MID = [107, 174, 214] as [number, number, number];   // Medio
const BLUE_DARK = [33, 113, 181] as [number, number, number];   // Oscuro


export const getAdvancedHeatmapColor = (
  value: number | null | undefined,
  metricType: HeatmapMetricType = 'price_change_percentage_24h',
  minVal: number = 0, // Min y Max del dataset para esta métrica (para métricas no porcentuales)
  maxVal: number = 1  // Min y Max del dataset para esta métrica
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'rgb(100,116,139)'; // bg-slate-500
  }

  if ((metricType as string).includes('_percentage_')) {
    const minPerc = -10; // Límite inferior para la escala de color
    const maxPerc = 10;  // Límite superior para la escala de color
    const midPoint = 0;

    if (value <= minPerc) return `rgb(${RED_STRONG.join(',')})`;
    if (value > minPerc && value < midPoint) {
      const factor = (value - minPerc) / (midPoint - minPerc);
      return interpolateColor(RED_STRONG, YELLOW_NEUTRAL, factor);
    }
    if (value === midPoint) return `rgb(${YELLOW_NEUTRAL.join(',')})`;
    if (value > midPoint && value < maxPerc) {
      const factor = (value - midPoint) / (maxPerc - midPoint);
      return interpolateColor(YELLOW_NEUTRAL, GREEN_STRONG, factor);
    }
    if (value >= maxPerc) return `rgb(${GREEN_STRONG.join(',')})`;

    return `rgb(${YELLOW_NEUTRAL.join(',')})`; // Fallback

  } else if (metricType === 'market_cap' || metricType === 'total_volume' || metricType === 'current_price') {
    // Normalizar el valor dentro del rango [minVal, maxVal]
    if (minVal === maxVal) return `rgb(${BLUE_MID.join(',')})`; // Evitar división por cero si todos los valores son iguales
    const factor = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));

    if (factor < 0.33) return interpolateColor(BLUE_LIGHT, BLUE_MID, factor / 0.33);
    if (factor < 0.66) return interpolateColor(BLUE_MID, BLUE_DARK, (factor - 0.33) / 0.33);
    return `rgb(${BLUE_DARK.join(',')})`;
  }

  return 'rgb(100,116,139)'; // Fallback para tipos de métricas no manejados (slate-500)
};
