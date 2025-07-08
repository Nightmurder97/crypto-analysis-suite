# 📋 PROMPTS COPY-PASTE UNIVERSALES
## Para Memoria y Rules de Cualquier Proyecto

**Propósito**: Prompts listos para copiar y pegar en cualquier configuración de IA

---

## 🧠 **MEMORY - COPIAR Y PEGAR**

```
SISTEMA_GESTION_PROYECTO_UNIVERSAL: Use este sistema para cualquier proyecto de desarrollo. SIEMPRE crear estructura docs/ con subdirectorios: system/ (documentación del sistema), planning/ (planes), technical/ (histórico técnico), backup/ (temporales), templates/ (guías). OBLIGATORIO: Crear PLAN_INTEGRADO_MAESTRO.md con matriz de tareas priorizadas, DOCUMENTACION_TECNICA.md para problemas complejos, ESTADO_PROYECTO.md para progreso. Documentar solo problemas complejos, no pasos triviales. Usar formato estándar de comunicación entre IAs. Minimizar chat, maximizar documentación en archivos .md. Protocolo de actualización: cambio de estado → actualizar 3 documentos → commit estándar. Estructura: README.md principal, docs/README.md como índice, enlaces cruzados funcionales.
```

---

## 🚀 **RULES - COPIAR Y PEGAR**

```
### GESTIÓN DE PROYECTOS MULTI-IA

**Estructura Obligatoria**:
- SIEMPRE crear carpeta docs/ con subdirectorios: system/, planning/, technical/, backup/, templates/
- OBLIGATORIO: PLAN_INTEGRADO_MAESTRO.md con matriz de tareas priorizadas
- OBLIGATORIO: DOCUMENTACION_TECNICA.md para problemas complejos únicamente
- OBLIGATORIO: ESTADO_PROYECTO.md para dashboard de progreso
- OBLIGATORIO: README.md principal + docs/README.md como índice

**Reglas de Trabajo**:
- SIEMPRE leer PLAN_INTEGRADO_MAESTRO.md antes de cualquier tarea
- SIEMPRE actualizar estado en 3 documentos al cambiar tarea: plan maestro, estado proyecto, documentación técnica (solo si complejo)
- NUNCA comenzar tarea sin revisar dependencias
- NUNCA saltarse criterios de aceptación definidos
- Minimizar comunicación en chat - Todo se documenta en archivos .md
- Usar formato estándar: TAREA: [ID] - [Descripción] | ESTADO: [🔴 PENDIENTE | 🟡 EN PROGRESO | ✅ COMPLETADO | ❌ BLOQUEADO] | COMPONENTE: [Archivo] | NOTAS: [Solo críticas]

**Protocolo de Actualización**:
1. Cambio de estado → actualizar tabla en plan maestro
2. Si problema complejo → documentar en DOCUMENTACION_TECNICA.md
3. Actualizar contadores en ESTADO_PROYECTO.md
4. Commit con formato: [TASK-ID] Descripción del cambio

**Documentación**:
- Documentar ÚNICAMENTE problemas complejos, apartados importantes, y grandes problemas que cuestan resolver
- NO documentar pasos menores, acciones obvias, o pequeños chequeos rutinarios
- Usar formato cronológico: Problema/Causa Raíz/Solución/Herramientas/Criterios/Estado
- Mantener enlaces cruzados entre documentos relacionados

**Criterios de Calidad**:
- Implementaciones robustas sobre parches rápidos
- Validación visual cuando sea posible
- Commits pequeños y frecuentes
- Compatibilidad multi-IA con contexto compartido
```

---

## 🎯 **TEMPLATE RÁPIDO PARA INICIALIZACIÓN**

### **1. Crear estructura inicial**
```bash
mkdir -p docs/system docs/planning docs/technical docs/backup docs/templates
```

### **2. Archivos obligatorios a crear**
```
docs/system/PLAN_INTEGRADO_MAESTRO.md
docs/system/DOCUMENTACION_TECNICA.md
docs/system/ESTADO_PROYECTO.md
docs/system/PROTOCOLO_IA_COLABORACION.md
docs/system/MATRIZ_TAREAS.md
docs/README.md
README.md
```

### **3. Formato de tarea estándar**
```markdown
| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **C1** | [Descripción] | 🔴 PENDIENTE | [Archivo] | [Tiempo] |
```

### **4. Formato de comunicación**
```
TAREA: E1 - Solucionar problema crítico
ESTADO: 🟡 EN PROGRESO
COMPONENTE: archivo.tsx
NOTAS: Requiere validación visual
```

---

## 📊 **PLANTILLA MATRIZ DE TAREAS**

```markdown
### **🔴 PRIORIDAD CRÍTICA**
| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **C1** | [Descripción tarea crítica] | 🔴 PENDIENTE | [Archivo] | [Tiempo] |

### **🟡 PRIORIDAD ALTA**
| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **A1** | [Descripción tarea alta] | 🟡 EN PROGRESO | [Archivo] | [Tiempo] |

### **🟢 PRIORIDAD MEDIA**
| ID | Tarea | Estado | Componente | Estimación |
|---|---|---|---|---|
| **M1** | [Descripción tarea media] | 🔴 PENDIENTE | [Archivo] | [Tiempo] |
```

---

## 🔄 **FLUJO DE TRABAJO ESTÁNDAR**

### **Al iniciar nueva tarea**:
1. Leer `PLAN_INTEGRADO_MAESTRO.md`
2. Verificar dependencias
3. Marcar como "🟡 EN PROGRESO"
4. Actualizar `ESTADO_PROYECTO.md`

### **Durante la tarea**:
1. Si problema complejo → documentar en `DOCUMENTACION_TECNICA.md`
2. Commits frecuentes con formato: `[TASK-ID] Descripción`

### **Al completar tarea**:
1. Verificar criterios de aceptación
2. Marcar como "✅ COMPLETADO"
3. Actualizar 3 documentos (plan, estado, técnico si aplica)
4. Commit final

---

## 🚨 **ESTADOS DE TAREAS**

- **🔴 PENDIENTE**: Sin iniciar
- **🟡 EN PROGRESO**: Actualmente trabajando
- **✅ COMPLETADO**: Terminado y verificado
- **❌ BLOQUEADO**: Impedido por dependencia externa

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **✅ Estructura Base**:
- [ ] Carpeta docs/ creada
- [ ] Subdirectorios system/, planning/, technical/, backup/, templates/
- [ ] README.md principal
- [ ] docs/README.md como índice

### **✅ Documentos Sistema**:
- [ ] PLAN_INTEGRADO_MAESTRO.md con matriz de tareas
- [ ] DOCUMENTACION_TECNICA.md inicializado
- [ ] ESTADO_PROYECTO.md con dashboard
- [ ] PROTOCOLO_IA_COLABORACION.md adaptado

### **✅ Proceso**:
- [ ] Identificación y priorización de tareas
- [ ] Criterios de aceptación definidos
- [ ] Orden de ejecución establecido
- [ ] Protocolo de actualización implementado

---

## 🎯 **ADAPTACIONES POR TIPO DE PROYECTO**

### **Software/Web**:
- Componentes: archivos .tsx/.ts/.js
- Criterios: testing, build, responsividad
- Herramientas: npm, git, linters

### **Análisis de Datos**:
- Componentes: datasets, notebooks, scripts
- Criterios: calidad datos, métricas, validación
- Herramientas: pandas, jupyter, APIs

### **Contenido/Documentación**:
- Componentes: documentos .md, imágenes
- Criterios: calidad editorial, estructura
- Herramientas: editores, revisión, publicación

---

## 📚 **REFERENCIAS**

- **Ejemplo Completo**: crypto-analysis-suite
- **Base Metodológica**: Sistema Multi-IA Universal
- **Plantillas**: Este documento como referencia

---

**Versión**: 1.0 - 08/01/2025  
**Aplicable a**: Cualquier proyecto de desarrollo  
**Mantenido por**: Metodología Multi-IA Universal 