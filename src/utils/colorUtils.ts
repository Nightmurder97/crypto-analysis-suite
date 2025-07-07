/**
 * Utility functions for color scales used in heatmaps.
 * SIMPLIFIED: Solo verde y rojo para mejor claridad visual
 */

type RGB = [number, number, number];

// Color for null or invalid values - más neutral
const NULL_COLOR = 'rgb(64, 64, 64)'; // gris neutral

/**
 * Interpolates between two RGB colors.
 */
export const interpolateColor = (
  color1: RGB,
  color2: RGB,
  factor: number
): string => {
  const r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
  const g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
  const b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
  return `rgb(${r},${g},${b})`;
};

// --- PALETAS SIMPLIFICADAS: SOLO VERDE Y ROJO ---

// Paleta para valores NEGATIVOS (rojos)
const RED_LIGHT: RGB = [248, 113, 113];     // #f87171 (valores cerca de 0, rojo claro)
const RED_MEDIUM: RGB = [239, 68, 68];      // #ef4444 (valores moderadamente negativos)
const RED_DARK: RGB = [185, 28, 28];        // #b91c1c (valores muy negativos, rojo oscuro)

// Paleta para valores POSITIVOS (verdes)
const GREEN_LIGHT: RGB = [134, 239, 172];   // #86efac (valores cerca de 0, verde claro)
const GREEN_MEDIUM: RGB = [34, 197, 94];    // #22c55e (valores moderadamente positivos)
const GREEN_DARK: RGB = [22, 101, 52];      // #166534 (valores muy positivos, verde oscuro)

// Color neutral para valores exactamente 0
const NEUTRAL_COLOR: RGB = [156, 163, 175];  // #9ca3af (gris neutro)

/**
 * Determines if a given RGB color is light or dark to decide text color.
 */
export const isColorLight = (rgbString: string): boolean => {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return false;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  
  // Formula for perceived brightness (YIQ)
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return brightness > 140; 
};

/**
 * Creates a simplified color scale: ROJO para negativos, VERDE para positivos
 * Escala más simple y clara para porcentajes de rendimiento
 */
export const createPerformanceColorScale = (
  _data: Array<number | null | undefined>
): ((value: number | null | undefined) => string) => {
  return (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return NULL_COLOR;
    }
    
    // Valor exactamente 0 = neutral
    if (value === 0) {
      return `rgb(${NEUTRAL_COLOR.join(',')})`;
    }
    
    // VALORES POSITIVOS = VERDE
    if (value > 0) {
      if (value > 10) {
        return `rgb(${GREEN_DARK.join(',')})`; // Verde oscuro para valores muy altos
      } else if (value > 3) {
        return `rgb(${GREEN_MEDIUM.join(',')})`; // Verde medio
      } else {
        return `rgb(${GREEN_LIGHT.join(',')})`; // Verde claro para valores bajos
      }
    }
    
    // VALORES NEGATIVOS = ROJO
    if (value < -10) {
      return `rgb(${RED_DARK.join(',')})`; // Rojo oscuro para valores muy negativos
    } else if (value < -3) {
      return `rgb(${RED_MEDIUM.join(',')})`; // Rojo medio
    } else {
      return `rgb(${RED_LIGHT.join(',')})`; // Rojo claro para valores ligeramente negativos
    }
  };
};

/**
 * Creates a sequential color scale for volume (blue scale maintained for differentiation)
 * Mantenemos azul para volumen para diferenciarlo del rendimiento
 */
export const createSequentialLogColorScale = (
  data: Array<number | null | undefined>
): ((value: number | null | undefined) => string) => {
  const validData = data.filter(
    (v): v is number => typeof v === 'number' && !isNaN(v) && v > 0
  );
  if (validData.length === 0) {
    return () => NULL_COLOR;
  }

  const logMin = Math.log10(Math.max(1, Math.min(...validData)));
  const logMax = Math.log10(Math.max(1, Math.max(...validData)));
  
  const range = logMax - logMin;
  
  // Paleta azul para volumen (diferente del verde/rojo de rendimiento)
  const VOLUME_LIGHT: RGB = [147, 197, 253];  // #93c5fd (azul claro - volumen bajo)
  const VOLUME_MEDIUM: RGB = [59, 130, 246];  // #3b82f6 (azul medio)
  const VOLUME_DARK: RGB = [29, 78, 216];     // #1d4ed8 (azul oscuro - volumen alto)

  return (value) => {
    if (value === null || value === undefined || isNaN(value) || value <= 0) {
      return NULL_COLOR;
    }
    
    const logVal = Math.log10(Math.max(1, value));
    const factor = range > 0 ? (logVal - logMin) / range : 0;
    const clampedFactor = Math.max(0, Math.min(1, factor));
    
    // Interpolación simple entre azul claro y oscuro
    if (clampedFactor < 0.5) {
      return interpolateColor(VOLUME_LIGHT, VOLUME_MEDIUM, clampedFactor * 2);
    } else {
      return interpolateColor(VOLUME_MEDIUM, VOLUME_DARK, (clampedFactor - 0.5) * 2);
    }
  };
};
