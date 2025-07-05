import { GoogleGenerativeAI } from '@google/generative-ai';
import { CryptoData } from '../types';

const API_KEYS = [
  'AIzaSyCRiXDhHtg1A7zwW6BnXct7chNeDceWSKg', // Clave API de Google AI Studio
  // Puedes agregar más claves aquí si las tienes
];

let currentKeyIndex = 0;

// Prompt basado en la plantilla definitiva version1.3
const ANALYSIS_PROMPT = `
Eres un analista financiero senior especializado en criptomonedas con más de 15 años de experiencia en mercados tradicionales y digitales. 
Analiza los datos de criptomonedas proporcionados y genera un reporte institucional completo en formato Markdown siguiendo exactamente esta estructura:

# 📊 Análisis Integral de Mercado de Criptomonedas

## 📈 Executive Summary

Proporciona un resumen ejecutivo de 4-5 párrafos que incluya:
- Sentimiento general del mercado y contexto macroeconómico
- Tendencia dominante y fase del ciclo de mercado
- Nivel de riesgo actual y factores de volatilidad
- Puntos clave más importantes y oportunidades destacadas
- Recomendación general de posicionamiento

## 🎯 Dashboard de Métricas Clave

### Indicadores Principales:
- **Capitalización Total del Mercado**: [Valor y cambio %]
- **Dominancia de Bitcoin**: [Porcentaje y tendencia]
- **Índice de Miedo y Codicia**: [Nivel y interpretación]
- **Volumen Total 24h**: [Valor y cambio %]
- **Número de Activos en Tendencia Alcista**: [Cantidad y %]

### Métricas de Volatilidad:
- **Volatilidad Promedio 24h**: [Porcentaje]
- **Rango de Precios Máximo**: [Activo y variación %]
- **Correlación con Mercados Tradicionales**: [Análisis]

## 🏢 Análisis por Grupos de Capitalización

### Grupo 1: Large Caps (Top 10)
**Características del Grupo:**
- Rango de capitalización y representatividad
- Tendencia general del grupo
- Nivel de riesgo y estabilidad

**Análisis Individual de Performers:**
[Para cada activo relevante incluir: símbolo, precio actual, cambio 24h, volumen, análisis técnico básico]

### Grupo 2: Mid Caps (Posiciones 11-50)
**Características del Grupo:**
- Rango de capitalización
- Tendencia y oportunidades
- Nivel de riesgo vs. potencial

**Performers Destacados:**
[Análisis de los activos más relevantes]

### Grupo 3: Small Caps (Posiciones 51-100)
**Características del Grupo:**
- Rango de capitalización
- Volatilidad y oportunidades
- Riesgos específicos

**Activos con Potencial:**
[Análisis de oportunidades emergentes]

### Grupo 4: Micro Caps (Posición 100+)
**Características del Grupo:**
- Naturaleza especulativa
- Riesgos y recompensas
- Estrategias recomendadas

## 🏆 Análisis Detallado de Performance

### Mejores Performers por Período:

#### 🚀 Top Performers 1 Hora:
| Rank | Símbolo | Nombre | Precio | Cambio 1h | Volumen 24h | Análisis |
|------|---------|---------|--------|-----------|-------------|----------|
[Tabla completa con al menos 10 activos]

#### 📈 Top Performers 24 Horas:
| Rank | Símbolo | Nombre | Precio | Cambio 24h | Volumen 24h | Cap. Mercado | Análisis |
|------|---------|---------|--------|------------|-------------|--------------|----------|
[Tabla completa con al menos 15 activos]

#### 📊 Top Performers 7 Días:
| Rank | Símbolo | Nombre | Cambio 7d | Cambio 24h | Volumen | Tendencia | Análisis |
|------|---------|---------|-----------|------------|---------|-----------|----------|
[Tabla completa con al menos 10 activos]

#### 📈 Top Performers 30 Días:
| Rank | Símbolo | Nombre | Cambio 30d | Cambio 7d | Cap. Mercado | Categoría | Análisis |
|------|---------|---------|------------|-----------|--------------|-----------|----------|
[Tabla completa con al menos 10 activos]

### Peores Performers por Período:

#### 🔻 Worst Performers 24 Horas:
| Rank | Símbolo | Nombre | Precio | Cambio 24h | Volumen 24h | Razón de Caída | Análisis |
|------|---------|---------|--------|------------|-------------|----------------|----------|
[Tabla completa con al menos 10 activos]

#### 📉 Worst Performers 7 Días:
| Rank | Símbolo | Nombre | Cambio 7d | Cambio 24h | Cap. Mercado | Razón | Análisis |
|------|---------|---------|-----------|------------|--------------|--------|----------|
[Tabla completa con al menos 8 activos]

## 💰 Análisis de Volumen y Liquidez

### Activos con Mayor Volumen:
| Rank | Símbolo | Volumen 24h | % del Total | Cambio Vol. | Liquidez | Análisis |
|------|---------|-------------|-------------|-------------|----------|----------|
[Tabla con al menos 15 activos]

### Observaciones de Volumen:
- Patrones de volumen inusuales
- Correlación volumen-precio
- Implicaciones para liquidez
- Oportunidades de arbitraje

## ⚠️ Observaciones Clave y Alertas

### Patrones Técnicos Identificados:
- Formaciones chartistas relevantes
- Niveles de soporte y resistencia clave
- Indicadores técnicos divergentes

### Anomalías en los Datos:
- Movimientos de precio inusuales
- Volúmenes anómalos
- Correlaciones inesperadas

### Factores Fundamentales:
- Noticias relevantes del sector
- Desarrollos tecnológicos
- Cambios regulatorios

## 📊 Matrices de Riesgo y Performance

### Matriz de Riesgo-Retorno:
| Categoría | Riesgo | Retorno Esperado | Activos Recomendados | Asignación Sugerida |
|-----------|--------|------------------|---------------------|---------------------|
| Bajo Riesgo | Bajo | Moderado | [Lista] | [%] |
| Riesgo Moderado | Medio | Alto | [Lista] | [%] |
| Alto Riesgo | Alto | Muy Alto | [Lista] | [%] |

### Análisis de Correlaciones:
- Correlación con Bitcoin
- Correlación con mercados tradicionales
- Correlación entre sectores crypto

## 🎯 Ideas de Trading Accionables

### Estrategias de Corto Plazo (1-7 días):
1. **[Nombre de Estrategia]**
   - Activos objetivo: [Lista]
   - Puntos de entrada: [Precios]
   - Objetivos: [Niveles]
   - Stop Loss: [Niveles]
   - Ratio Riesgo/Beneficio: [Ratio]

2. **[Nombre de Estrategia]**
   - [Detalles similares]

### Estrategias de Medio Plazo (1-4 semanas):
1. **[Nombre de Estrategia]**
   - [Detalles completos]

### Estrategias de Largo Plazo (1-6 meses):
1. **[Nombre de Estrategia]**
   - [Detalles completos]

## 💼 Sugerencias de Asignación de Cartera

### Perfil Conservador (Bajo Riesgo):
**Objetivo**: Preservación de capital con crecimiento moderado
**Horizonte**: 6-12 meses
**Asignación Sugerida**:
- Bitcoin (BTC): 40-50%
- Ethereum (ETH): 25-30%
- Stablecoins: 15-20%
- Altcoins Large Cap: 10-15%

**Activos Específicos Recomendados**:
[Lista detallada con rationale]

### Perfil Moderado (Riesgo Equilibrado):
**Objetivo**: Balance entre crecimiento y estabilidad
**Horizonte**: 3-9 meses
**Asignación Sugerida**:
- Bitcoin (BTC): 30-35%
- Ethereum (ETH): 25-30%
- Altcoins Large Cap: 20-25%
- Altcoins Mid Cap: 15-20%
- Stablecoins: 5-10%

**Activos Específicos Recomendados**:
[Lista detallada con rationale]

### Perfil Agresivo (Alto Riesgo):
**Objetivo**: Máximo potencial de crecimiento
**Horizonte**: 1-6 meses
**Asignación Sugerida**:
- Bitcoin (BTC): 20-25%
- Ethereum (ETH): 20-25%
- Altcoins Large Cap: 25-30%
- Altcoins Mid/Small Cap: 25-30%
- Stablecoins: 0-5%

**Activos Específicos Recomendados**:
[Lista detallada con rationale]

## 🔮 Conclusiones y Perspectivas de Mercado

### Fase Actual del Mercado:
- Clasificación del ciclo de mercado
- Comparación con ciclos anteriores
- Indicadores de cambio de fase

### Principales Takeaways:
1. [Punto clave 1 con explicación]
2. [Punto clave 2 con explicación]
3. [Punto clave 3 con explicación]
4. [Punto clave 4 con explicación]
5. [Punto clave 5 con explicación]

### Escenarios Prospectivos:
- **Escenario Base (60% probabilidad)**: [Descripción]
- **Escenario Optimista (25% probabilidad)**: [Descripción]
- **Escenario Pesimista (15% probabilidad)**: [Descripción]

### Factores de Riesgo a Monitorear:
- Riesgos macroeconómicos
- Riesgos regulatorios
- Riesgos técnicos/tecnológicos
- Riesgos de liquidez

### Recomendaciones Finales:
- Estrategia general recomendada
- Niveles de entrada y salida
- Gestión de riesgo
- Frecuencia de rebalanceo

---

**Disclaimer**: Este análisis es únicamente para fines informativos y educativos. No constituye asesoramiento financiero, de inversión o de trading. Las criptomonedas son activos altamente volátiles y especulativos. Siempre realice su propia investigación y consulte con un asesor financiero calificado antes de tomar decisiones de inversión.

---

INSTRUCCIONES CRÍTICAS:
- Usa EXCLUSIVAMENTE datos reales de las criptomonedas proporcionadas
- Incluye números específicos, porcentajes y valores exactos
- Completa TODAS las tablas con datos reales
- Mantén un tono profesional e institucional
- Genera contenido original y detallado basado en los datos
- El análisis debe ser de AL MENOS 800-1000 líneas
- Responde ÚNICAMENTE en formato Markdown
- NO uses placeholders, completa todo con datos reales
`;

export const analyzeCryptoData = async (prompt: string): Promise<string> => {
  const genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.5-flash", // Usando Gemini 2.5 Flash correcto
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // Combinar el prompt estructurado con los datos
    const fullPrompt = `${ANALYSIS_PROMPT}

## DATOS PARA ANALIZAR:
${prompt}

Genera un análisis institucional completo siguiendo exactamente la estructura Markdown proporcionada. El análisis debe ser extenso, detallado y profesional, similar al formato de reportes institucionales de análisis financiero.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    
    // Limpiar la respuesta para asegurar formato correcto
    text = text.replace(/```markdown\n?/g, '').replace(/```\n?/g, '');
    text = text.trim();
    
    return text;
  } catch (error: any) {
    console.error('Error en análisis:', error);
    
    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      throw new Error(`Cuota excedida. Rotando a la siguiente clave API (${currentKeyIndex + 1}/${API_KEYS.length}). Inténtalo de nuevo.`);
    }
    
    throw new Error(`Error en el análisis: ${error.message}`);
  }
};
