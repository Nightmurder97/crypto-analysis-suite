# 🤖 PROTOCOLO DE COLABORACIÓN ENTRE IAS
## Crypto Analysis Suite - Estándares de Trabajo Multi-Agente

**Fecha Creación**: 08/01/2025 - 07:35  
**Versión**: 1.0  
**Propósito**: Estandarizar comunicación y trabajo entre diferentes IAs/agentes

---

## 🎯 **OBJETIVOS DEL PROTOCOLO**

1. **Minimizar comunicación en chat** - Todo se documenta en archivos .md
2. **Mantener contexto compartido** - Diferentes IAs pueden tomar el trabajo donde se quedó otra
3. **Evitar duplicación** - Trabajo sistemático sin solapamiento
4. **Garantizar calidad** - Estándares consistentes de implementación

---

## 📋 **REGLAS FUNDAMENTALES**

### **🔴 OBLIGATORIAS**

1. **SIEMPRE leer `PLAN_INTEGRADO_MAESTRO.md` antes de comenzar**
2. **SIEMPRE actualizar estado de tareas al cambiar**
3. **SIEMPRE documentar problemas complejos en `DOCUMENTACION_TECNICA.md`**
4. **NUNCA comenzar una tarea sin revisar dependencias**
5. **NUNCA saltarse los criterios de aceptación**

### **🟡 RECOMENDADAS**

1. **Preferir implementaciones robustas sobre parches rápidos**
2. **Validar cambios visualmente cuando sea posible**
3. **Usar commits pequeños y frecuentes**
4. **Pedir confirmación para cambios arquitectónicos**

---

## 🗣️ **FORMATO DE COMUNICACIÓN ESTÁNDAR**

### **Al comenzar una tarea**:
```markdown
## INICIANDO TAREA
**ID**: [E1, E2, 1.1, etc.]
**Descripción**: [Descripción completa]
**Componente**: [Archivo principal]
**Dependencias**: [Lista de dependencias]
**Estimación**: [Tiempo estimado]
**Estado**: 🟡 EN PROGRESO
```

### **Al completar una tarea**:
```markdown
## TAREA COMPLETADA
**ID**: [E1, E2, 1.1, etc.]
**Resultado**: [Descripción del resultado]
**Archivos modificados**: [Lista de archivos]
**Criterios cumplidos**: [Lista de criterios]
**Estado**: ✅ COMPLETADO
**Próxima tarea sugerida**: [ID de siguiente tarea]
```

### **Al encontrar un bloqueo**:
```markdown
## TAREA BLOQUEADA
**ID**: [E1, E2, 1.1, etc.]
**Problema**: [Descripción del bloqueo]
**Causa raíz**: [Análisis técnico]
**Solución propuesta**: [Opciones de resolución]
**Estado**: ❌ BLOQUEADO
**Requiere**: [Acción necesaria para desbloquear]
```

---

## 📊 **PROCESO DE ACTUALIZACIÓN DE ESTADO**

### **Cada vez que una tarea cambia de estado**:

1. **Actualizar `PLAN_INTEGRADO_MAESTRO.md`**:
   - Cambiar estado en la tabla de tareas
   - Actualizar fecha de última modificación

2. **Actualizar `ESTADO_PROYECTO.md`**:
   - Modificar contador de tareas completadas
   - Actualizar porcentaje de progreso

3. **Documentar en `DOCUMENTACION_TECNICA.md`** (solo si es complejo):
   - Añadir entrada con problema y solución
   - Incluir herramientas utilizadas

4. **Commit con formato estándar**:
   ```
   [TASK-ID] Descripción corta del cambio
   
   - Descripción detallada
   - Archivos principales modificados
   - Criterios de aceptación cumplidos
   ```

---

## 🔧 **COMANDOS ESTÁNDAR DE VALIDACIÓN**

### **Antes de comenzar cualquier tarea**:
```bash
# Verificar estado actual del proyecto
npm run dev
# Verificar que no hay errores de build
npm run build
# Revisar git status
git status
```

### **Después de completar una tarea**:
```bash
# Verificar funcionalidad
npm run dev
# Revisar cambios
git diff
# Commit con formato estándar
git add .
git commit -m "[TASK-ID] Descripción"
```

---

## 📝 **PLANTILLAS DE DOCUMENTACIÓN**

### **Para problemas complejos en `DOCUMENTACION_TECNICA.md`**:
```markdown
## 📅 **DD/MM/YYYY - HH:MM**
### **TAREA [ID]**: [Título]

**Problema**: 
[Descripción del problema encontrado]

**Causa Raíz**: 
[Análisis técnico de la causa]

**Solución Implementada**:
[Pasos específicos tomados]

**Herramientas Utilizadas**:
- [Lista de herramientas]

**Criterios de Aceptación Cumplidos**:
- [Lista de criterios]

**Estado**: [COMPLETADO/BLOQUEADO/EN PROGRESO]
```

### **Para comunicación en chat (mínima)**:
```markdown
TAREA: [ID] - [Descripción corta]
ESTADO: [🔴 PENDIENTE | 🟡 EN PROGRESO | ✅ COMPLETADO | ❌ BLOQUEADO]
COMPONENTE: [Archivo principal]
NOTAS: [Solo observaciones críticas]
```

---

## 🚨 **GESTIÓN DE CONFLICTOS**

### **Si dos IAs trabajan en tareas relacionadas**:
1. **Verificar dependencias** en `PLAN_INTEGRADO_MAESTRO.md`
2. **Priorizar por orden de ejecución** establecido
3. **Documentar conflicto** en `DOCUMENTACION_TECNICA.md`
4. **Comunicar en chat** solo si es crítico

### **Si una tarea no puede completarse**:
1. **Marcar como BLOQUEADA** en todos los documentos
2. **Documentar causa raíz** detalladamente
3. **Proponer soluciones alternativas**
4. **Actualizar estimaciones** si es necesario

---

## 🔍 **CRITERIOS DE CALIDAD**

### **Antes de marcar una tarea como COMPLETADA**:
- ✅ **Funcionalidad**: La funcionalidad implementada trabaja correctamente
- ✅ **Estética**: Los cambios visuales son coherentes con el diseño
- ✅ **Responsividad**: Los cambios funcionan en diferentes tamaños de pantalla
- ✅ **Rendimiento**: No hay regresiones de rendimiento observables
- ✅ **Limpieza**: No hay código comentado, console.logs o imports innecesarios

### **Criterios específicos por tipo de tarea**:

**Para tareas de UI/UX**:
- ✅ Espaciado consistente
- ✅ Colores según paleta establecida
- ✅ Tipografía homogénea
- ✅ Interacciones intuitivas

**Para tareas de lógica/datos**:
- ✅ Manejo de errores robusto
- ✅ Validación de datos de entrada
- ✅ Optimización de rendimiento
- ✅ Código documentado

**Para tareas de integración**:
- ✅ APIs funcionando correctamente
- ✅ Manejo de estados de carga
- ✅ Gestión de errores de red
- ✅ Datos mostrados correctamente

---

## 🎯 **MEJORES PRÁCTICAS**

### **Trabajo eficiente**:
1. **Leer contexto completo** antes de comenzar
2. **Usar herramientas en paralelo** cuando sea posible
3. **Validar cambios incrementalmente**
4. **Documentar decisiones técnicas importantes**

### **Comunicación efectiva**:
1. **Usar documentos como fuente de verdad**
2. **Chat solo para confirmaciones/aclaraciones**
3. **Formato estándar para actualizaciones**
4. **Referencias cruzadas entre documentos**

### **Mantenimiento del sistema**:
1. **Actualizar fechas de modificación**
2. **Mantener contadores de progreso**
3. **Limpiar referencias obsoletas**
4. **Validar integridad de enlaces**

---

## 📚 **REFERENCIAS RÁPIDAS**

- `PLAN_INTEGRADO_MAESTRO.md` → Plan general y matriz de tareas
- `ESTADO_PROYECTO.md` → Estado actual consolidado
- `DOCUMENTACION_TECNICA.md` → Log técnico de problemas complejos
- `MATRIZ_TAREAS.md` → Seguimiento detallado de progreso

---

**Última Actualización**: 08/01/2025 - 07:35  
**Responsable**: Sistema de Gestión Multi-IA  
**Próxima Revisión**: 15/01/2025 