# Plan de Acción Inicial para Mejoras de la Suite de Análisis Cripto

## Fase 1: Mejoras de Interfaz de Usuario (UI) y Experiencia de Usuario (UX)

**1.1. Corregir Alineación de la Tabla de Resumen**

* **Problema:** Los datos de la primera página de resumen están desalineados.
* **Acciones:**
  * [ ] Localizar el componente que renderiza la tabla (`CryptoTable.tsx` o `AnalysisSection.tsx`).
  * [ ] Inspeccionar y corregir el CSS para alinear las columnas.

**1.2. Actualizar Gradientes de Color en los Heatmaps**

* **Problema:** Los gradientes de color actuales dificultan la visualización.
* **Acciones:**
  * [ ] Localizar los componentes de heatmap (`HeatmapDisplay.tsx`, `ClassicHeatmapDisplay.tsx`).
  * [ ] Modificar la función en `src/utils/colorUtils.ts` o el CSS para usar los nuevos gradientes de las imágenes de ejemplo.

**1.3. Eliminar Secciones "Simulador de Portafolio" y "Reportes"**

* **Problema:** Las secciones deben ser eliminadas de la interfaz.
* **Acciones:**
  * [ ] Encontrar y eliminar los archivos de los componentes (`PortfolioSimulator.tsx`, `ReportsSection.tsx`).
  * [ ] Limpiar las referencias y rutas a estos componentes en `App.tsx` y la navegación.

**1.4. Hacer Desplegable el Ranking de Sectores**

* **Problema:** El análisis sectorial no permite ver los tokens dentro de cada categoría.
* **Acciones:**
  * [ ] Localizar el componente de "Análisis Sectorial".
  * [ ] Usar `useState` para gestionar el estado expandido/colapsado.
  * [ ] Añadir un evento `onClick` para mostrar/ocultar la lista de tokens de cada sector.

---

## Fase 2: Mejoras en la Lógica de Análisis y Datos

**2.1. Enriquecer la Página de Estadísticas**

* **Problema:** Faltan rankings de volumen y los insights son genéricos.
* **Acciones:**
  * [ ] Añadir dos nuevas listas: "Top 10 por Volumen" y "Worst 10 por Volumen".
  * [ ] Modificar el prompt en `geminiService.ts` para que la IA especifique los tokens en sus insights.

---

## Fase 3: Reingeniería de la Generación de Reportes con IA

**3.1. Alinear el Reporte de IA con la Plantilla**

* **Problema:** El reporte de IA no sigue la plantilla `Template_DDMMYYYY_Thh:mm.md.md`.
* **Acciones:**
  * [ ] Revisar `src/services/geminiService.ts`.
  * [ ] Diseñar un "mega-prompt" que contenga la estructura completa de la plantilla para que la IA la rellene en una sola llamada.
  * [ ] Implementar y probar el nuevo prompt.
