# 📂 CryptoAnalysisExports

Esta carpeta contiene todas las exportaciones de datos y reportes generados por la **Crypto Analysis Suite**.

## 📁 Estructura de Carpetas

```
CryptoAnalysisExports/
├── 2025-01-07/                    # Carpeta por fecha (YYYY-MM-DD)
│   ├── crypto_overview_data_*.xlsx
│   ├── crypto_complete_data_*.xlsx
│   ├── crypto_analysis_complete_*.xlsx
│   ├── crypto_market_analysis_*.xlsx
│   └── crypto_market_analysis_*.md
├── 2025-01-08/
│   └── ...
└── README.md                      # Este archivo
```

## 📊 Tipos de Exportación

### 1. **Datos de Criptomonedas**
- **📊 Resumen (.xlsx)**: Campos básicos y métricas principales
- **📈 Completo (.xlsx)**: Todos los campos disponibles de la API
- **🗂️ Multi-Hoja (.xlsx)**: Archivo con múltiples hojas (Resumen, Heatmap, Heatmap Clásico)

### 2. **Reportes de Análisis IA**
- **📄 Reporte (.md)**: Análisis en formato Markdown
- **📊 Reporte (.xlsx)**: Análisis estructurado en Excel con metadatos

### 3. **Datos de Visualización**
- **🔥 Heatmap Página (.xlsx)**: Datos de la página actual del heatmap
- **🎯 Heatmap Clásico (.xlsx)**: Datos del heatmap clásico filtrado

## 🔧 Configuración

### Formato de Nombres de Archivo
- **Timestamp**: `YYYY-MM-DDTHH-MM-SS`
- **Ejemplo**: `crypto_overview_data_2025-01-07T14-30-15.xlsx`

### Campos Incluidos

#### Resumen (Overview)
- Ranking, Nombre, Símbolo
- Precio actual (USD)
- Cambios porcentuales (1h, 24h, 7d, 30d)
- Capitalización de mercado
- Volumen 24h

#### Completo (Complete)
- Todos los campos del resumen
- Datos de sparkline
- Información adicional de la API de CoinGecko

#### Multi-Hoja (Multi-Sheet)
- **Hoja 1**: Resumen general
- **Hoja 2**: Datos del heatmap
- **Hoja 3**: Datos del heatmap clásico

## 🚀 Ventajas del Formato XLSX

1. **Mayor Compatibilidad**: Compatible con Excel, Google Sheets, LibreOffice
2. **Mejor Estructura**: Múltiples hojas en un solo archivo
3. **Formato Nativo**: Números se mantienen como números (no texto)
4. **Metadatos**: Información adicional sobre la exportación
5. **Compresión**: Archivos más pequeños que CSV equivalentes

## 📍 Ubicación Fija

Todos los archivos se guardan automáticamente en esta carpeta, organizados por fecha. Esto facilita:
- **Seguimiento histórico** de exportaciones
- **Backup automático** de datos
- **Análisis comparativo** entre fechas
- **Organización centralizada** de todos los archivos

## 💡 Uso Recomendado

1. **Análisis Diario**: Exportar datos completos al final del día
2. **Reportes Semanales**: Usar análisis IA para reportes ejecutivos
3. **Investigación**: Mantener historial de datos para análisis de tendencias
4. **Backup**: Carpeta puede ser respaldada regularmente

---

*Generado automáticamente por Crypto Analysis Suite* 