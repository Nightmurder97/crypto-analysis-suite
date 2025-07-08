# 🚀 Onboarding y Continuidad – Crypto Analysis Suite

## 📝 Prompt de Contexto para Nuevos Colaboradores/IA

**Proyecto:** Crypto Analysis Suite  
**Descripción:** Aplicación web avanzada para análisis y visualización de datos de criptomonedas, con integración de IA (Google Gemini) y datos de CoinGecko.

### Estado actual del proyecto

- **Funcionalidades principales implementadas:**
  - Tabla de overview de las 1000 principales criptomonedas (ordenable, filtrable).
  - Heatmaps de mercado (performance y volumen), heatmap clásico y por sector.
  - Análisis estadístico y simulador de portafolio.
  - Generación de informes profesionales con IA (Google Gemini), usando una plantilla estructurada y en español.
  - Exportación de datos a CSV desde cualquier vista.
  - Reportes visuales e infográficos.
- **Integraciones:**  
  - **CoinGecko API** para datos de mercado (requiere manejo de CORS en navegador).
  - **Google Gemini API** para análisis de IA (requiere clave API y respetar límites de cuota).
- **Documentación:**  
  - `README.md` actualizado y en español, con estructura real del proyecto, instrucciones de instalación y advertencias sobre CORS y límites de Gemini.
  - `INSTRUCCIONES.md` con pasos rápidos para ejecutar la app y advertencias clave.
- **Notas técnicas:**
  - El análisis de IA utiliza un prompt avanzado que fuerza el formato profesional, en español, y adapta el informe a los datos y contexto real.
  - El frontend está hecho en React + TypeScript, con CSS Modules y Vite.
  - El manejo de errores de CORS y límites de Gemini está documentado y gestionado en la app.
  - El código está modularizado en componentes bajo `src/components/`.

### Recomendaciones para continuar

- Si se requiere ampliar funcionalidades, revisar los archivos de componentes en `src/components/`.
- Para modificar el análisis de IA, editar el prompt en `src/App.tsx` y/o la lógica en `src/services/geminiService.ts`.
- Si se presentan errores de CORS, seguir las recomendaciones del README.
- Si se supera la cuota de Gemini, cambiar de clave o proyecto en Google Cloud.
- Consultar los archivos de reportes generados en la carpeta `Reports/` para ejemplos de salidas.

---

## ✅ Checklist de cosas realizadas

- [x] Estructura del proyecto organizada y modularizada.
- [x] Tabla de overview de criptomonedas.
- [x] Heatmaps de mercado (dual, clásico, por sector).
- [x] Análisis estadístico y simulador de portafolio.
- [x] Generación de informes con IA (Google Gemini) en español profesional.
- [x] Exportación de datos a CSV.
- [x] Reportes visuales e infográficos.
- [x] Gestión de errores de CORS y límites de Gemini documentada.
- [x] README.md actualizado y traducido.
- [x] INSTRUCCIONES.md creado para ejecución rápida.
- [x] Prompt de IA afinado para informes profesionales.
- [x] Código limpio y comentado.
- [x] Soporte para exclusión de stablecoins.
- [x] Actualización automática de la hora en el encabezado.
- [x] Manejo de paginación en heatmaps y tablas.
- [x] Descarga de reportes generados en Markdown.

## ⏳ Checklist de cosas pendientes o mejorables

- [ ] Actualizar los valores del encabezado (Market Cap, Volumen 24h, BTC Dominance) para que sean dinámicos y en tiempo real.
- [ ] Agregar tests unitarios y de integración.
- [ ] Internacionalización (i18n) para otros idiomas.
- [ ] Mejorar la visualización de errores para el usuario final.
- [ ] Optimizar el manejo de rate limits de CoinGecko (caché o backend proxy).
- [ ] Agregar autenticación de usuario (si se requiere).
- [ ] Permitir configuración avanzada del prompt de IA desde la interfaz.
- [ ] Agregar más métricas técnicas (RSI, MACD, medias móviles, etc.).
- [ ] Automatizar la generación y almacenamiento de reportes.
- [ ] Documentar ejemplos de reportes generados en `Reports/` y en el README.
- [ ] Optimizar el rendimiento para grandes volúmenes de datos.
- [ ] Agregar modo oscuro/claro configurable.
- [ ] Desplegar la app en un entorno productivo y documentar el proceso.

---

**Resumen:**
El proyecto está listo para análisis, visualización y generación de informes de criptomonedas con IA. La estructura y documentación están actualizadas. Solo asegúrate de tener la clave de Gemini y de gestionar CORS según sea necesario. 