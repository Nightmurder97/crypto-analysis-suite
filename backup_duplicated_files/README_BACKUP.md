# Archivos de Respaldo - Crypto Analysis Suite

## Fecha de Respaldo: 5 de julio de 2025

Esta carpeta contiene archivos duplicados que se encontraban en la raíz del proyecto y que causaban conflictos con los archivos principales ubicados en la carpeta `src/`.

## Archivos Movidos

### Componentes React Duplicados:
- `AnalysisSection.tsx` - Duplicado de `src/components/AnalysisSection.tsx`
- `App.tsx` - Duplicado de `src/App.tsx`
- `ClassicHeatmapDisplay.tsx` - Duplicado de `src/components/ClassicHeatmapDisplay.tsx`
- `CryptoTable.tsx` - Duplicado de `src/components/CryptoTable.tsx`
- `HeatmapDisplay.tsx` - Duplicado de `src/components/HeatmapDisplay.tsx`
- `HeatmapControls.tsx` - Duplicado de `src/components/HeatmapControls.tsx`
- `index.tsx` - Duplicado de `src/index.tsx`

### Archivos de Servicios y Utilidades:
- `apiClient.ts` - Duplicado de `src/utils/apiClient.ts`
- `geminiService.ts` - Duplicado de `src/services/geminiService.ts`

### Archivos CSS:
- `ClassicHeatmapDisplay.module.css` - Archivo CSS duplicado
- `HeatmapDisplay.module.css` - Archivo CSS duplicado

### Archivos de Metadatos:
- `metadata.json` - Archivo de metadatos duplicado
- `metadata-1.json` - Archivo de metadatos duplicado

### Archivos Auxiliares:
- `index-1.tsx` - Archivo auxiliar no utilizado
- `untitled.tsx` - Archivo vacío no utilizado

### Archivos HTML Estáticos (en subcarpeta):
En la carpeta `static_html_files/`:
- `crypto_analysis_dashboard.html`
- `crypto_executive_report.html`
- `crypto_heatmap.html`
- `crypto_histograms.html`
- `crypto_infographic.html`
- `crypto_portfolio_simulator.html`
- `index-1.html`

## Razón del Respaldo

Estos archivos se movieron porque:
1. Causaban conflictos de duplicación con los archivos principales en `src/`
2. Los imports en el proyecto se confundían entre las versiones de la raíz y las de `src/`
3. La estructura del proyecto necesitaba ser limpiada para seguir las mejores prácticas

## Archivos Principales Activos

Los archivos principales que se están utilizando actualmente están en:
- `src/` - Carpeta principal del código fuente
- `src/components/` - Componentes React
- `src/services/` - Servicios (API de Gemini)
- `src/utils/` - Utilidades (API de CoinGecko, exportadores)

## Recuperación

Si necesitas recuperar algún archivo de este respaldo:
1. Compara el archivo de respaldo con el archivo actual en `src/`
2. Si necesitas código específico, cópialo manualmente
3. **NO** muevas los archivos completos de vuelta sin revisar conflictos

## Seguridad

Estos archivos se mantienen como respaldo por 30 días. Después de ese período, pueden ser eliminados si no se necesitan. 