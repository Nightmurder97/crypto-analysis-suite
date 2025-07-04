# 📈 Crypto Analysis Suite

Bienvenido a Crypto Analysis Suite, una aplicación web integral para el análisis profesional del mercado de criptomonedas. Esta herramienta ofrece una interfaz avanzada para visualizar datos, obtener análisis impulsados por IA y simular estrategias de portafolio.

## ✨ Funcionalidades

- **Resumen de datos**: Tabla ordenable y filtrable con métricas de las 1000 principales criptomonedas.
- **Heatmaps de mercado**: Visualizaciones para identificar tendencias:
    - **Heatmap dual**: Rendimiento y volumen en paralelo.
    - **Heatmap clásico**: Cuadrícula configurable para distintos indicadores.
    - **Heatmap por sector**: Análisis por sector (IA, DeFi, Gaming, etc.).
- **Análisis estadístico**: Gráficos y distribuciones para estudiar volatilidad y outliers.
- **Análisis con IA**: Usa la API de Google Gemini para generar informes y resúmenes profesionales.
- **Simulador de portafolio**: Herramienta interactiva para crear y probar portafolios virtuales.
- **Reportes visuales**: Infografía dinámica y resumen ejecutivo profesional.
- **Exportación de datos**: Descarga de datos en CSV desde cualquier vista.

## 🛠️ Tecnologías

- **Frontend**: React, TypeScript
- **Estilos**: CSS Modules
- **IA**: Google Gemini API (`@google/genai`)
- **Gráficos**: Chart.js con `react-chartjs-2`
- **Datos**: CoinGecko API
- **Build**: Vite

## 📁 Estructura del proyecto

```
crypto-analysis-suite/
├── src/
│   ├── components/
│   │   ├── AnalysisSection.tsx
│   │   ├── ClassicHeatmapDisplay.tsx
│   │   ├── CryptoTable.tsx
│   │   ├── HeatmapControls.tsx
│   │   ├── HeatmapDisplay.tsx
│   │   ├── IconComponents.tsx
│   │   ├── PaginationControls.tsx
│   │   ├── ReportsView.tsx
│   │   ├── SectorHeatmapView.tsx
│   │   ├── SimulatorView.tsx
│   │   └── StatisticsView.tsx
│   ├── services/
│   │   └── geminiService.ts
│   ├── utils/
│   │   ├── apiClient.ts
│   │   ├── csvExporter.ts
│   │   └── csvParser.ts
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   └── types.ts
├── Reports/
│   └── ... (reportes generados)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── README.md
```

## 🚀 Instrucciones rápidas de ejecución

### 1. Requisitos previos
- Node.js (v18 o superior)
- npm

### 2. Instalación

```bash
git clone <url-del-repositorio>
cd crypto-analysis-suite
npm install
```

### 3. Variables de entorno

Para usar el análisis con IA, necesitas una clave de API de Google Gemini.

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade tu clave:

    ```
    GEMINI_API_KEY=TU_CLAVE_AQUI
    ```

### 4. Ejecución

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.

### 5. Notas importantes
- **CORS**: Si tienes errores de CORS al consultar CoinGecko, revisa la configuración de tu navegador o usa extensiones para desactivar restricciones.
- **Límites de Gemini**: Si ves errores de cuota (`429 RESOURCE_EXHAUSTED`), tu clave ha superado el límite gratuito. Cambia de clave o proyecto en Google Cloud.

## 🤝 Contribuciones
¡Se agradecen contribuciones! Abre un issue o pull request para sugerencias o mejoras.
