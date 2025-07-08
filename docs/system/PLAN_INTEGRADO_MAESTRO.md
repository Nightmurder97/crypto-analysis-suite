# 🎯 PLAN INTEGRADO MAESTRO
## Crypto Analysis Suite - Sistema de Gestión Unificado

**Fecha Creación**: 08/01/2025 - 07:30
**Última Actualización**: 08/01/2025 - 08:30
**Estado General**: ACTIVO
**Prioridad**: ALTA

---

## 📋 **RESUMEN EJECUTIVO**

Este documento integra todos los planes de trabajo existentes (`plan.md`, `Contraplan.md`, `Resolution.md`) y los nuevos errores identificados en una matriz unificada de tareas priorizadas.

### **Objetivos Principales**:
1. **Finalizar mejoras UI/UX pendientes** (Fase 1)
2. **Resolver errores críticos identificados** (Nuevos)
3. **Mejorar análisis de datos** (Fase 2)
4. **Reingeniería de reportes IA** (Fase 3)

### **Método de Trabajo**:
- ✅ **Documentación primero**: Todo se documenta en archivos .md
- ✅ **Comunicación mínima en chat**: Solo confirmaciones y aclaraciones
- ✅ **Estados actualizados**: Cada tarea tiene estado rastreable
- ✅ **Compatibilidad multi-IA**: Formato estándar para diferentes agentes

---

## 🗂️ **MATRIZ DE TAREAS INTEGRADA**

### **🔴 PRIORIDAD CRÍTICA - ERRORES NUEVOS**

| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **E1** | Solucionar gap en marcos de páginas | ✅ COMPLETADO | Layout global | 2h |
| **E2** | Corregir iconos dispares tabla principal | ✅ COMPLETADO | CryptoTable.tsx | 1h |
| **E3.1** | Especificar niveles de pérdida en estadísticas | 🔴 PENDIENTE | StatisticsView.tsx | 1h |
| **E3.2** | Recuadro gris en distribución rendimientos | 🔴 PENDIENTE | StatisticsView.tsx | 30min |
| **E3.3** | Colores verde/rojo en top volumen | 🔴 PENDIENTE | StatisticsView.tsx | 30min |
| **E3.4** | Restaurar 4 insights con tokens específicos | 🔴 PENDIENTE | StatisticsView.tsx | 1h |
| **E4.1** | Actualizar prompt IA para reporte específico | ✅ COMPLETADO | geminiService.ts | 2h |
| **E5** | Corregir datos de criptomonedas en la tabla principal | ✅ COMPLETADO | CryptoTable.tsx | 3h |
| **E6** | Añadir botones de descarga de reportes .md | 🔴 PENDIENTE | AnalysisSection.tsx | 1.5h |

### **🟡 PRIORIDAD ALTA - MEJORAS PENDIENTES**

| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **1.1** | Corregir alineación tabla resumen | ✅ COMPLETADO | CryptoTable.tsx | - |
| **1.2** | Actualizar gradientes heatmaps | 🟡 EN PROGRESO | colorUtils.ts | 3h |
| **1.3** | Eliminar secciones Simulador/Reportes | 🔴 PENDIENTE | App.tsx | 1h |
| **1.4** | Hacer desplegable ranking sectores | 🔴 PENDIENTE | SectorHeatmapView.tsx | 2h |
| **2.1** | Enriquecer página estadísticas | 🔴 PENDIENTE | StatisticsView.tsx | 2h |
| **3.1** | Resolver data gap reportes | 🔴 PENDIENTE | Template/Data | 4h |
| **3.2** | Implementar generación por secciones | 🔴 PENDIENTE | geminiService.ts | 6h |

---

## 📊 **ORDEN DE EJECUCIÓN RECOMENDADO**

### **Sprint 1: Corrección de Errores Críticos (Estimado: 5h)**
```
1. E1 → Solucionar gap marcos páginas
2. E2 → Corregir iconos dispares
3. E3.1-E3.4 → Completar página estadísticas
4. E4.1 → Actualizar prompt IA
5. E5 → Corregir datos de criptomonedas
6. E6 → Añadir botones de descarga
```

### **Sprint 2: Finalización UI/UX (Estimado: 6h)**
```
7. 1.2 → Completar gradientes heatmaps
8. 1.3 → Eliminar secciones innecesarias
9. 1.4 → Implementar desplegables sectores
```

### **Sprint 3: Mejoras Avanzadas (Estimado: 12h)**
```
10. 2.1 → Enriquecer estadísticas
11. 3.1 → Resolver data gap
12. 3.2 → Reingeniería reportes IA
```

---

## 🔧 **CRITERIOS DE ACEPTACIÓN**

### **Para Errores Críticos (E1-E6)**:
- ✅ **E1**: Página ocupa todo el ancho disponible sin gaps
- ✅ **E2**: Iconos uniformes en tamaño y alineación
- ✅ **E3.1**: Valores específicos de pérdida mostrados
- ✅ **E3.2**: Fondo gris consistente en todas las secciones
- ✅ **E3.3**: Verde para ganadores, rojo para perdedores
- ✅ **E3.4**: 4 insights específicos con nombres de tokens
- ✅ **E4.1**: Reporte sigue template con datos reales
- ✅ **E5**: Datos de la tabla coinciden con los proporcionados en `valoresreales.csv`
- ✅ **E6**: Botón de descarga funcional que genera un archivo .md del análisis

### **Para Mejoras UI/UX (1.x)**:
- ✅ **1.2**: Gradientes visibles y diferenciados
- ✅ **1.3**: Secciones removidas sin referencias huérfanas
- ✅ **1.4**: Sectores expandibles/contraíbles

### **Para Mejoras Avanzadas (2.x-3.x)**:
- ✅ **2.1**: Rankings volumen con datos actualizados
- ✅ **3.1**: Template simplificado sin datos faltantes
- ✅ **3.2**: Reportes generados por secciones coherentes

---

## 📝 **PROTOCOLO DE ACTUALIZACIÓN**

### **Cuando una tarea cambia de estado**:
1. Actualizar tabla en este documento
2. Añadir entrada en `DOCUMENTACION_TECNICA.md`
3. Actualizar `ESTADO_PROYECTO.md`
4. Commit con mensaje estándar: `[TASK-ID] Descripción del cambio`

### **Formato de comunicación con IA**:
```
TAREA: [ID] - [Descripción]
ESTADO: [🔴 PENDIENTE | 🟡 EN PROGRESO | ✅ COMPLETADO | ❌ BLOQUEADO]
COMPONENTE: [Archivo principal afectado]
NOTAS: [Observaciones específicas]
```

### **📝 NORMA OBLIGATORIA DE REGISTRO Y VERACIDAD DE DATOS**

- Está prohibido inventar, imaginar o estimar valores, fechas, horas o datos en la documentación o comunicación.
- Si no se sabe un dato, se debe indicar explícitamente: "Dato no disponible" o "No se sabe".
- En caso de usar valores simulados, debe especificarse claramente y dejar constancia visible de que son simulados.
- Antes de documentar cualquier evento, problema o incidente en archivos .md, el agente debe preguntar y confirmar con el usuario la fecha y hora exacta a registrar.

---

## 🚨 **RIESGOS Y MITIGACIONES**

### **Riesgo Alto**: Interferencia entre tareas
- **Mitigación**: Orden de ejecución estricto por dependencias

### **Riesgo Medio**: Regresiones en funcionalidad
- **Mitigación**: Testing visual después de cada tarea

### **Riesgo Bajo**: Inconsistencia en documentación
- **Mitigación**: Protocolo de actualización obligatorio

---

## 📚 **REFERENCIAS CRUZADAS**

- `DOCUMENTACION_TECNICA.md` → Log técnico detallado
- `ESTADO_PROYECTO.md` → Estado consolidado actual
- `MATRIZ_TAREAS.md` → Seguimiento detallado de progreso
- `PROTOCOLO_IA_COLABORACION.md` → Reglas de trabajo multi-IA

---

**Siguiente Acción**: Ejecutar Sprint 1 comenzando por tarea E1
**Responsable**: Agente IA asignado
**Fecha Límite**: 08/01/2025 - 15:00
