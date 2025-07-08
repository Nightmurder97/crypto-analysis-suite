# Análisis de Viabilidad y Riesgos del Plan Sugerido (Contraplan)

Este documento analiza el `Plan.md` para identificar riesgos, suposiciones incorrectas y posibles incompatibilidades con la arquitectura actual del proyecto.

## Análisis de Fase 1 (UI/UX)

* **1.1. Riesgo en Alineación de Tabla:**

  * **Conflicto:** Asumir que es un simple error de CSS es arriesgado. El proyecto podría estar usando una librería de tablas (`react-table`, etc.) con su propia API para la configuración de columnas. Un parche de CSS podría entrar en conflicto con la librería y romper la responsividad.
  * **Análisis:** Es necesario primero identificar si se usa una librería externa para renderizar la tabla en `CryptoTable.tsx` antes de intentar una solución.
* **1.2. Riesgo en Gradientes de Heatmap:**

  * **Conflicto:** La lógica de color podría no estar centralizada en `colorUtils.ts`. Podría estar duplicada en los componentes o incluso definida directamente en archivos CSS/CSS-in-JS.
  * **Análisis:** Se requiere una fase de exploración para localizar con certeza el origen de la generación de colores. La modificación será simple si está centralizada, pero compleja si está dispersa.
* **1.3. Riesgo en Eliminación de Componentes:**

  * **Conflicto:** Mínimo, pero existente. Eliminar los componentes puede dejar código huérfano (helpers, hooks, estado en `Context` o `Redux` que eran usados solo por ellos), lo que afectaría la mantenibilidad del código.
  * **Análisis:** El plan debe incluir una pasada de limpieza (búsqueda de referencias no utilizadas) tras la eliminación.
* **1.4. Riesgo en Ranking de Sectores Desplegable:**

  * **Conflicto:** Se asume que los datos ya llegan al componente agrupados por sector. Sin embargo, lo más probable es que se reciban dos listas separadas: (1) datos de mercado y (2) categorías del CSV. La lógica de **unir y agrupar** estos datos probablemente no exista y deba ser construida.
  * **Análisis:** Se debe validar el flujo de datos desde `csvCategoriesService.ts` y añadir una tarea para implementar la lógica de agrupación en el frontend.

## Análisis de Fase 2 (Lógica de Análisis)

* **2.1. Riesgo en Página de Estadísticas:**
  * **Conflicto 1 (Rendimiento):** Ordenar una lista de 1000 criptomonedas por volumen en cada renderizado del componente puede causar problemas de rendimiento en el cliente.
  * **Análisis 1:** Se debe optimizar el cálculo usando `useMemo` para que el ordenamiento solo se ejecute cuando los datos cambien.
  * **Conflicto 2 (IA):** Asumir que la IA seguirá las instrucciones de "especificar tokens" a la primera es optimista. Los modelos de lenguaje requieren iteración en el diseño de prompts para lograr la fiabilidad deseada.
  * **Análisis 2:** La tarea debe ser redefinida como "iterar en el prompt para mejorar la especificidad" en lugar de "modificar el prompt".

## Análisis de Fase 3 (Generación de Reportes IA)

* **3.1. Riesgos Críticos en la Generación del Reporte:**
  * **Conflicto 1 (Límite de Contexto):** La plantilla (`Template_DDMMYYYY_Thh:mm.md.md`) es extremadamente larga y detallada. Es muy probable que, al combinarla con los datos de mercado de cientos de monedas, se exceda el límite de tokens del contexto de la API de Gemini, provocando un fallo en la llamada.
  * **Conflicto 2 (Complejidad vs. Fiabilidad):** Un único "mega-prompt" es demasiado complejo. La IA probablemente "olvidaría" instrucciones a mitad de la generación, resultando en un reporte incompleto, con formato incorrecto o con contenido repetitivo.
  * **Conflicto 3 (Gap de Datos):** La plantilla solicita datos muy específicos (RSI, MACD, "Razón del Pump", niveles de soporte/resistencia) que **no están presentes** en los datos de entrada actuales (`crypto_market_analysis...md`). La IA no puede analizar lo que no se le proporciona y se vería forzada a alucinar o dejar secciones en blanco.
  * **Análisis General:** El enfoque de "mega-prompt en una llamada" es inviable. Se necesita una estrategia completamente diferente.

## Conclusión del Contraplan

El plan inicial es una buena guía, pero contiene suposiciones que podrían llevar a una implementación ineficiente o fallida, especialmente en la Fase 3. Se requiere un plan final que incorpore estos análisis de riesgo.
