# Paso 1.2: Corrección y Mejora de Gradientes en Heatmaps

**1. Problema Resuelto:**
Se han solucionado los gradientes de color ineficaces en los heatmaps de rendimiento y volumen, que no representaban adecuadamente la distribución de los datos y dificultaban el análisis visual.

**2. Causa Raíz Identificada:**
La implementación inicial falló por dos motivos:
*   **Falta de Contexto:** La función de coloreado (`getAdvancedHeatmapColor`) operaba sobre celdas individuales, sin conocer el rango completo de valores (`min`, `max`, `promedio`) del conjunto de datos. Esto hacía imposible crear una escala de color relativa y significativa.
*   **Distribución de Datos Desigual:** Los valores de rendimiento y, especialmente, de volumen no se distribuyen de manera uniforme. El uso de una escala lineal simple provocaba que la mayoría de los valores se agruparan en un solo color, ocultando los matices.

**3. Solución Implementada:**
Se adoptó una estrategia de refactorización integral en dos fases:

*   **Fase 1: Refactorización de `src/utils/colorUtils.ts`:**
    *   Se eliminó la función estática `getAdvancedHeatmapColor`.
    *   Se crearon dos **funciones de fábrica** (`factory functions`):
        *   `createPerformanceColorScale`: Recibe todos los datos de una métrica de rendimiento y genera una función de coloreado basada en **percentiles (P5 a P95)**. Esto centra el gradiente en el 90% de los datos más relevantes, ignorando los valores atípicos extremos.
        *   `createQuantileColorScale`: Recibe todos los datos de volumen y genera una función de coloreado que divide los datos en **cuantiles**. Cada cuantil tiene un color discreto, lo que es ideal para datos con una distribución de ley de potencias como el volumen.

*   **Fase 2: Refactorización de `src/components/HeatmapDisplay.tsx`:**
    *   Dentro del componente, se utiliza el hook `useMemo` para calcular las escalas de color una sola vez por cada renderizado, evitando cálculos innecesarios y optimizando el rendimiento.
    *   Estas escalas (que son funciones) se pasan a cada celda `HeatmapCell` para aplicar el color correcto basado en su valor, ahora sí, con el contexto completo de la distribución de datos.

**4. Herramientas Utilizadas:**
*   `grep_search`: Para localizar el uso de la función de coloreado.
*   `edit_file`: Para refactorizar `colorUtils.ts` y `HeatmapDisplay.tsx`.
*   `reapply`: Para corregir un fallo en la aplicación de la refactorización inicial.
*   **Conceptos de Programación:** `Percentiles`, `Cuantiles`, `Factory Functions`, `Memoization` (con `useMemo`). 