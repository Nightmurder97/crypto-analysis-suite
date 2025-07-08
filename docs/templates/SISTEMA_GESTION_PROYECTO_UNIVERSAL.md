# 🎯 SISTEMA DE GESTIÓN DE PROYECTOS UNIVERSAL
## Metodología Integrada Multi-IA para Cualquier Proyecto

**Versión**: 1.0  
**Fecha**: 08/01/2025  
**Propósito**: Prompt generalizable para gestión sistemática de proyectos con múltiples IAs

---

## 🧠 **MEMORY PARA SISTEMA DE GESTIÓN**

```
SISTEMA_GESTION_PROYECTO_UNIVERSAL: Use este sistema para cualquier proyecto de desarrollo. SIEMPRE crear estructura docs/ con subdirectorios: system/ (documentación del sistema), planning/ (planes), technical/ (histórico técnico), backup/ (temporales), templates/ (guías). OBLIGATORIO: Crear PLAN_INTEGRADO_MAESTRO.md con matriz de tareas priorizadas, DOCUMENTACION_TECNICA.md para problemas complejos, ESTADO_PROYECTO.md para progreso. Documentar solo problemas complejos, no pasos triviales. Usar formato estándar de comunicación entre IAs. Minimizar chat, maximizar documentación en archivos .md. Protocolo de actualización: cambio de estado → actualizar 3 documentos → commit estándar.
```

---

## 🚀 **RULES PARA GESTIÓN DE PROYECTOS**

### **📋 ESTRUCTURA OBLIGATORIA**

```
proyecto/
├── README.md                    # Información principal del proyecto
├── docs/                        # Documentación organizada
│   ├── README.md               # Índice completo de documentación
│   ├── system/                 # Sistema de documentación
│   │   ├── PLAN_INTEGRADO_MAESTRO.md
│   │   ├── DOCUMENTACION_TECNICA.md
│   │   ├── ESTADO_PROYECTO.md
│   │   ├── PROTOCOLO_IA_COLABORACION.md
│   │   └── MATRIZ_TAREAS.md
│   ├── planning/               # Planes y análisis
│   ├── technical/              # Histórico técnico
│   ├── backup/                 # Archivos temporales
│   └── templates/              # Guías y plantillas
└── [resto del proyecto]
```

### **🔴 REGLAS OBLIGATORIAS**

1. **SIEMPRE** crear estructura docs/ antes de comenzar trabajo
2. **SIEMPRE** leer PLAN_INTEGRADO_MAESTRO.md antes de cualquier tarea
3. **SIEMPRE** actualizar estado en 3 documentos al cambiar tarea
4. **NUNCA** comenzar tarea sin revisar dependencias
5. **NUNCA** saltarse criterios de aceptación definidos

### **🟡 REGLAS RECOMENDADAS**

1. **Minimizar comunicación en chat** - Todo se documenta en .md
2. **Usar formato estándar** de comunicación entre IAs
3. **Commits pequeños y frecuentes** con mensajes descriptivos
4. **Validación visual** cuando sea posible
5. **Implementaciones robustas** sobre parches rápidos

---

## 📊 **PLANTILLA: PLAN_INTEGRADO_MAESTRO.md**

```markdown
# 🎯 PLAN INTEGRADO MAESTRO
## [NOMBRE_PROYECTO] - Sistema de Gestión Unificado

**Fecha Creación**: [DD/MM/YYYY - HH:MM]
**Última Actualización**: [DD/MM/YYYY - HH:MM]  
**Estado General**: [ACTIVO/PAUSA/COMPLETADO]
**Prioridad**: [ALTA/MEDIA/BAJA]

---

## 📋 **RESUMEN EJECUTIVO**

### **Objetivos Principales**:
1. [Objetivo 1] (Fase 1)
2. [Objetivo 2] (Fase 2)
3. [Objetivo 3] (Fase 3)

### **Método de Trabajo**:
- ✅ **Documentación primero**: Todo se documenta en archivos .md
- ✅ **Comunicación mínima en chat**: Solo confirmaciones y aclaraciones
- ✅ **Estados actualizados**: Cada tarea tiene estado rastreable
- ✅ **Compatibilidad multi-IA**: Formato estándar para diferentes agentes

---

## 🗂️ **MATRIZ DE TAREAS**

### **🔴 PRIORIDAD CRÍTICA**

| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **C1** | [Descripción tarea crítica] | 🔴 PENDIENTE | [Archivo] | [Tiempo] |
| **C2** | [Descripción tarea crítica] | 🔴 PENDIENTE | [Archivo] | [Tiempo] |

### **🟡 PRIORIDAD ALTA**

| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **A1** | [Descripción tarea alta] | 🟡 EN PROGRESO | [Archivo] | [Tiempo] |
| **A2** | [Descripción tarea alta] | 🔴 PENDIENTE | [Archivo] | [Tiempo] |

### **🟢 PRIORIDAD MEDIA**

| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **M1** | [Descripción tarea media] | 🔴 PENDIENTE | [Archivo] | [Tiempo] |

---

## 📊 **ORDEN DE EJECUCIÓN**

### **Sprint 1: [Nombre Sprint] (Estimado: [X]h)**
```
1. [ID] → [Descripción]
2. [ID] → [Descripción]
```

### **Sprint 2: [Nombre Sprint] (Estimado: [X]h)**
```
3. [ID] → [Descripción]
4. [ID] → [Descripción]
```

---

## 🔧 **CRITERIOS DE ACEPTACIÓN**

### **Para tareas críticas**:
- ✅ **[ID]**: [Criterio específico]
- ✅ **[ID]**: [Criterio específico]

### **Para tareas de alta prioridad**:
- ✅ **[ID]**: [Criterio específico]
- ✅ **[ID]**: [Criterio específico]

---

## 📝 **PROTOCOLO DE ACTUALIZACIÓN**

### **Cuando una tarea cambia de estado**:
1. Actualizar tabla en este documento
2. Añadir entrada en `DOCUMENTACION_TECNICA.md` (solo si es complejo)
3. Actualizar `ESTADO_PROYECTO.md`
4. Commit con mensaje: `[TASK-ID] Descripción del cambio`

### **Formato de comunicación con IA**:
```
TAREA: [ID] - [Descripción]
ESTADO: [🔴 PENDIENTE | 🟡 EN PROGRESO | ✅ COMPLETADO | ❌ BLOQUEADO]
COMPONENTE: [Archivo principal afectado]
NOTAS: [Solo observaciones críticas]
```

---

## 🚨 **RIESGOS Y MITIGACIONES**

### **Riesgo Alto**: [Descripción riesgo]
- **Mitigación**: [Estrategia de mitigación]

### **Riesgo Medio**: [Descripción riesgo]
- **Mitigación**: [Estrategia de mitigación]

---

## 📚 **REFERENCIAS CRUZADAS**

- `DOCUMENTACION_TECNICA.md` → Log técnico detallado
- `ESTADO_PROYECTO.md` → Estado consolidado actual
- `MATRIZ_TAREAS.md` → Seguimiento detallado de progreso
- `PROTOCOLO_IA_COLABORACION.md` → Reglas de trabajo multi-IA

---

**Siguiente Acción**: [Próxima tarea específica]
**Responsable**: [Agente IA asignado]
**Fecha Límite**: [DD/MM/YYYY - HH:MM]
```

---

## 📄 **PLANTILLA: DOCUMENTACION_TECNICA.md**

```markdown
# 📋 DOCUMENTACIÓN TÉCNICA
## [NOMBRE_PROYECTO] - Log de Resolución de Problemas

**Propósito**: Documentar únicamente problemas complejos, apartados importantes del proceso, y grandes problemas que cuestan resolver.

---

## 📅 **DD/MM/YYYY - HH:MM**
### **TAREA [ID]**: [Título descriptivo]

**Problema**: 
[Descripción del problema encontrado]

**Causa Raíz**: 
[Análisis técnico de la causa]

**Solución Implementada**:
[Pasos específicos tomados]

**Herramientas Utilizadas**:
- [Lista de herramientas]

**Criterios de Aceptación Cumplidos**:
- ✅ [Criterio 1]
- ✅ [Criterio 2]

**Estado**: [COMPLETADO/BLOQUEADO/EN PROGRESO]

---

[Repetir para cada problema complejo]
```

---

## 📈 **PLANTILLA: ESTADO_PROYECTO.md**

```markdown
# 📊 ESTADO DEL PROYECTO
## [NOMBRE_PROYECTO] - Dashboard de Progreso

**Última Actualización**: [DD/MM/YYYY - HH:MM]
**Estado General**: [ACTIVO/PAUSA/COMPLETADO]

---

## 🎯 **RESUMEN EJECUTIVO**

### **Progreso General**:
- **Tareas Completadas**: [X] / [TOTAL] ([XX]%)
- **Tareas en Progreso**: [X]
- **Tareas Bloqueadas**: [X]
- **Estimación Restante**: [XX] horas

### **Estado por Prioridad**:
- **🔴 Críticas**: [X] de [TOTAL] completadas
- **🟡 Altas**: [X] de [TOTAL] completadas  
- **🟢 Medias**: [X] de [TOTAL] completadas

---

## 📋 **TAREAS ACTIVAS**

### **🟡 EN PROGRESO**:
- **[ID]**: [Descripción] - [Componente]

### **🔴 PRÓXIMAS (CRÍTICAS)**:
- **[ID]**: [Descripción] - [Componente]

### **❌ BLOQUEADAS**:
- **[ID]**: [Descripción] - [Razón del bloqueo]

---

## 🏆 **COMPLETADAS RECIENTEMENTE**

### **✅ ÚLTIMAS 5 TAREAS**:
- **[ID]**: [Descripción] - [Fecha]
- **[ID]**: [Descripción] - [Fecha]

---

## 🚨 **ALERTAS Y PROBLEMAS**

### **🔴 CRÍTICOS**:
- [Problema crítico actual]

### **🟡 ADVERTENCIAS**:
- [Advertencia o riesgo]

---

## 📅 **PRÓXIMOS HITOS**

- **[Fecha]**: [Hito 1]
- **[Fecha]**: [Hito 2]

---

**Mantenido por**: Sistema Multi-IA
**Próxima Revisión**: [DD/MM/YYYY]
```

---

## 🔄 **PROTOCOLO DE IMPLEMENTACIÓN**

### **Al iniciar un nuevo proyecto**:
1. **Crear estructura docs/** con subdirectorios
2. **Inicializar PLAN_INTEGRADO_MAESTRO.md** con tareas identificadas
3. **Establecer DOCUMENTACION_TECNICA.md** vacío
4. **Crear ESTADO_PROYECTO.md** con estado inicial
5. **Definir PROTOCOLO_IA_COLABORACION.md** adaptado al proyecto

### **Durante el desarrollo**:
1. **Cada tarea**: Leer plan maestro → ejecutar → actualizar 3 documentos
2. **Problemas complejos**: Documentar inmediatamente en técnico
3. **Cambios de estado**: Actualizar dashboard de progreso
4. **Commits**: Usar formato estándar con ID de tarea

### **Al finalizar el proyecto**:
1. **Marcar todas las tareas como completadas**
2. **Actualizar estado general a COMPLETADO**
3. **Crear resumen ejecutivo en plan maestro**
4. **Archivar documentos temporales**

---

## 🎯 **ADAPTACIONES POR TIPO DE PROYECTO**

### **Proyectos de Software**:
- Incluir componentes/archivos específicos
- Criterios de testing y build
- Gestión de dependencias

### **Proyectos de Análisis**:
- Datasets y fuentes de datos
- Criterios de calidad de datos
- Métricas de validación

### **Proyectos de Contenido**:
- Estructura de documentos
- Criterios de calidad editorial
- Flujos de revisión

---

## 📚 **REFERENCIAS PARA IMPLEMENTACIÓN**

- **Ejemplo Real**: [crypto-analysis-suite](https://github.com/usuario/crypto-analysis-suite)
- **Documentación Base**: `docs/system/`
- **Plantillas**: Usar este documento como referencia

---

**Creado por**: Metodología Multi-IA Universal  
**Aplicable a**: Cualquier proyecto de desarrollo  
**Versión**: 1.0 - 08/01/2025 