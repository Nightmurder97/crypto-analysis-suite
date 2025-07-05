import { GoogleGenerativeAI } from '@google/generative-ai';
import { CryptoData } from '../types';

const API_KEYS = [
  'AIzaSyCRiXDhHtg1A7zwW6BnXct7chNeDceWSKg', // Clave API de Google AI Studio
  // Puedes agregar más claves aquí si las tienes
];

let currentKeyIndex = 0;

// Prompt mejorado con elementos técnicos específicos y granularidad operativa
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

## 🎯 Technical Levels Dashboard

### Niveles Técnicos Clave BTC:
- **Soporte Inmediato**: [Precio específico]
- **Resistencia Inmediata**: [Precio específico]
- **Soporte Mayor**: [Precio específico]  
- **Resistencia Mayor**: [Precio específico]
- **RSI Actual**: [Valor y interpretación]
- **MACD**: [Señal y divergencias]

### Niveles Técnicos Clave ETH:
- **Soporte Inmediato**: [Precio específico]
- **Resistencia Inmediata**: [Precio específico]
- **Soporte Mayor**: [Precio específico]
- **Resistencia Mayor**: [Precio específico]
- **RSI Actual**: [Valor y interpretación]
- **MACD**: [Señal y divergencias]

### Niveles Técnicos Altcoins Principales:
[Para los 5 altcoins más relevantes, incluir niveles específicos de soporte/resistencia]

## 🏢 Análisis por Grupos de Capitalización

### Grupo 1: Large Caps (Top 10)
**Características del Grupo:**
- Rango de capitalización y representatividad
- Tendencia general del grupo
- Nivel de riesgo y estabilidad

**Análisis Individual de Performers:**
[Para cada activo relevante incluir: símbolo, precio actual, cambio 24h, volumen, análisis técnico básico]

**💎 Must-Take Messages - Large Caps:**
• [Activo]: [Razón específica de oportunidad]
• [Activo]: [Razón específica de oportunidad]
• [Activo]: [Razón específica de oportunidad]

**🎯 Estrategias Específicas Large Caps:**
| Activo | Entrada | Trigger | Salida | SL | R:R | Timeframe |
|--------|---------|---------|--------|----|-----|-----------|
| [SYM] | [Precio] | [Condición] | [Target] | [Stop] | [Ratio] | [Tiempo] |
| [SYM] | [Precio] | [Condición] | [Target] | [Stop] | [Ratio] | [Tiempo] |

**📊 Scoring System Large Caps:**
| Activo | Score Inversión (1-10) | Score Riesgo (1-10) | Score Liquidez (1-5) | Recomendación |
|--------|----------------------|-------------------|-------------------|---------------|
| [SYM] | [Score] | [Score] | [Score] | [Acción] |
| [SYM] | [Score] | [Score] | [Score] | [Acción] |

**🏭 Análisis Sectorial Large Caps:**
- **DeFi**: [Análisis del ecosistema DeFi, principales protocolos, TVL trends]
- **Layer 1**: [Análisis de blockchains principales, competencia, adopción]
- **Payments**: [Análisis de cryptos de pago, adopción institucional]
- **Infrastructure**: [Análisis de infraestructura blockchain, oráculos, etc.]

### 📊 Scoring Detallado Large Caps:
| Símbolo | Nombre | Precio | Score Inversión | Score Riesgo | Score Liquidez | Recomendación |
|---------|---------|--------|----------------|-------------|----------------|---------------|
| BTC | Bitcoin | $X | X/10 | X/10 | X/5 | Acción específica |
| ETH | Ethereum | $X | X/10 | X/10 | X/5 | Acción específica |
| SOL | Solana | $X | X/10 | X/10 | X/5 | Acción específica |
| BNB | BNB | $X | X/10 | X/10 | X/5 | Acción específica |
| XRP | XRP | $X | X/10 | X/10 | X/5 | Acción específica |
| USDC | USD Coin | $X | X/10 | X/10 | X/5 | Acción específica |
| ADA | Cardano | $X | X/10 | X/10 | X/5 | Acción específica |
| DOGE | Dogecoin | $X | X/10 | X/10 | X/5 | Acción específica |
| AVAX | Avalanche | $X | X/10 | X/10 | X/5 | Acción específica |
| LINK | Chainlink | $X | X/10 | X/10 | X/5 | Acción específica |

### 💎 Must-Take Messages - Large Caps:
• **[ACTIVO 1]**: [Razón específica por la que es oportunidad destacada]
• **[ACTIVO 2]**: [Razón específica por la que es oportunidad destacada]
• **[ACTIVO 3]**: [Razón específica por la que es oportunidad destacada]
• **[ACTIVO 4]**: [Razón específica por la que es oportunidad destacada]
• **[ACTIVO 5]**: [Razón específica por la que es oportunidad destacada]

### 🎯 Estrategias Granulares Large Caps:
| Activo | Entrada | Trigger | Salida | SL | R:R | Timeframe | Estrategia |
|--------|---------|---------|--------|----|-----|-----------|------------|
| BTC | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| ETH | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| SOL | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| BNB | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| XRP | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |

### 🔍 Consideraciones Técnicas Large Caps:
- **Patrón Chartista Dominante**: [Descripción específica del patrón]
- **Correlación BTC/ETH**: [Nivel específico y análisis]
- **Divergencias RSI**: [Activos con divergencias y significado]
- **Niveles de Fibonacci**: [Niveles clave para principales activos]
- **Volumen Profile**: [Análisis de distribución de volumen]

## 🔹 GRUPO 2: MID CAPS ($1B - $10B)

### 📈 Top Performers Mid Caps:

#### 🚀 Top Performers 1 Hora:
| Rank | Símbolo | Nombre | Precio | Cambio 1h | Volumen 1h | Cap. Mercado | Razón del Pump | Análisis |
|------|---------|---------|--------|-----------|------------|--------------|----------------|----------|
[Tabla completa con al menos 10 activos Mid Cap]

#### ⚡ Top Performers 24 Horas:
| Rank | Símbolo | Nombre | Precio | Cambio 24h | Volumen 24h | Cap. Mercado | Razón del Pump | Análisis |
|------|---------|---------|--------|------------|-------------|--------------|----------------|----------|
[Tabla completa con al menos 10 activos Mid Cap]

#### 📊 Top Performers 7 Días:
| Rank | Símbolo | Nombre | Cambio 7d | Cambio 24h | Cap. Mercado | Razón | Análisis |
|------|---------|---------|-----------|------------|--------------|--------|----------|
[Tabla completa con al menos 8 activos Mid Cap]

#### 🏆 Top Performers 30 Días:
| Rank | Símbolo | Nombre | Cambio 30d | Cambio 7d | Cap. Mercado | Razón | Análisis |
|------|---------|---------|------------|-----------|--------------|--------|----------|
[Tabla completa con al menos 8 activos Mid Cap]

### 🏭 Análisis Sectorial Mid Caps:
- **DeFi Protocols**: [Análisis específico de protocolos DeFi Mid Cap]
- **Gaming & NFTs**: [Análisis de tokens gaming y NFT ecosystems]
- **Layer 2 Solutions**: [Análisis de soluciones L2 y scaling]
- **AI & Data**: [Análisis de tokens AI y manejo de datos]
- **Meme Coins**: [Análisis de meme coins establecidos]

### 📊 Scoring Detallado Mid Caps:
| Símbolo | Nombre | Precio | Score Inversión | Score Riesgo | Score Liquidez | Recomendación |
|---------|---------|--------|----------------|-------------|----------------|---------------|
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |

### 💎 Must-Take Messages - Mid Caps:
• **[ACTIVO 1]**: [Razón específica con contexto de performance]
• **[ACTIVO 2]**: [Razón específica con contexto de performance]
• **[ACTIVO 3]**: [Razón específica con contexto de performance]
• **[ACTIVO 4]**: [Razón específica con contexto de performance]
• **[ACTIVO 5]**: [Razón específica con contexto de performance]

### 🎯 Estrategias Granulares Mid Caps:
| Activo | Entrada | Trigger | Salida | SL | R:R | Timeframe | Estrategia |
|--------|---------|---------|--------|----|-----|-----------|------------|
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |

### 🔍 Consideraciones Técnicas Mid Caps:
- **Patrón Chartista Dominante**: [Descripción específica del patrón]
- **Correlación con BTC**: [Nivel específico y análisis]
- **Divergencias Técnicas**: [Activos con divergencias y significado]
- **Niveles de Soporte/Resistencia**: [Niveles clave para principales activos]
- **Análisis de Volumen**: [Patrones de volumen y liquidez]

## 🔸 GRUPO 3: SMALL CAPS ($100M - $1B)

### 📈 Top Performers Small Caps:

#### 🚀 Top Performers 1 Hora:
| Rank | Símbolo | Nombre | Precio | Cambio 1h | Volumen 1h | Cap. Mercado | Razón del Pump | Análisis |
|------|---------|---------|--------|-----------|------------|--------------|----------------|----------|
[Tabla completa con al menos 10 activos Small Cap]

#### ⚡ Top Performers 24 Horas:
| Rank | Símbolo | Nombre | Precio | Cambio 24h | Volumen 24h | Cap. Mercado | Razón del Pump | Análisis |
|------|---------|---------|--------|------------|-------------|--------------|----------------|----------|
[Tabla completa con al menos 10 activos Small Cap]

#### 📊 Top Performers 7 Días:
| Rank | Símbolo | Nombre | Cambio 7d | Cambio 24h | Cap. Mercado | Razón | Análisis |
|------|---------|---------|-----------|------------|--------------|--------|----------|
[Tabla completa con al menos 8 activos Small Cap]

#### 🏆 Top Performers 30 Días:
| Rank | Símbolo | Nombre | Cambio 30d | Cambio 7d | Cap. Mercado | Razón | Análisis |
|------|---------|---------|------------|-----------|--------------|--------|----------|
[Tabla completa con al menos 8 activos Small Cap]

### 🏭 Análisis Sectorial Small Caps:
- **Emerging DeFi**: [Análisis de protocolos DeFi emergentes]
- **Gaming Tokens**: [Análisis de tokens gaming específicos]
- **NFT Ecosystems**: [Análisis de ecosistemas NFT]
- **AI & Machine Learning**: [Análisis de tokens AI emergentes]
- **Utility Tokens**: [Análisis de tokens de utilidad específica]

### 📊 Scoring Detallado Small Caps:
| Símbolo | Nombre | Precio | Score Inversión | Score Riesgo | Score Liquidez | Recomendación |
|---------|---------|--------|----------------|-------------|----------------|---------------|
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |

### 💎 Must-Take Messages - Small Caps:
• **[ACTIVO 1]**: [Razón específica con contexto de oportunidad]
• **[ACTIVO 2]**: [Razón específica con contexto de oportunidad]
• **[ACTIVO 3]**: [Razón específica con contexto de oportunidad]
• **[ACTIVO 4]**: [Razón específica con contexto de oportunidad]
• **[ACTIVO 5]**: [Razón específica con contexto de oportunidad]

### 🎯 Estrategias Granulares Small Caps:
| Activo | Entrada | Trigger | Salida | SL | R:R | Timeframe | Estrategia |
|--------|---------|---------|--------|----|-----|-----------|------------|
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |

### 🔍 Consideraciones Técnicas Small Caps:
- **Patrón Chartista Dominante**: [Descripción específica del patrón]
- **Correlación con Mercado**: [Nivel específico y análisis]
- **Riesgos de Liquidez**: [Análisis específico de liquidez]
- **Niveles Críticos**: [Niveles clave para principales activos]
- **Análisis de Momentum**: [Patrones de momentum y volatilidad]

## 🔺 GRUPO 4: MICRO CAPS (<$100M)

### 📈 Top Performers Micro Caps:

#### 🚀 Top Performers 1 Hora:
| Rank | Símbolo | Nombre | Precio | Cambio 1h | Volumen 1h | Cap. Mercado | Razón del Pump | Análisis |
|------|---------|---------|--------|-----------|------------|--------------|----------------|----------|
[Tabla completa con al menos 10 activos Micro Cap]

#### ⚡ Top Performers 24 Horas:
| Rank | Símbolo | Nombre | Precio | Cambio 24h | Volumen 24h | Cap. Mercado | Razón del Pump | Análisis |
|------|---------|---------|--------|------------|-------------|--------------|----------------|----------|
[Tabla completa con al menos 10 activos Micro Cap]

#### 📊 Top Performers 7 Días:
| Rank | Símbolo | Nombre | Cambio 7d | Cambio 24h | Cap. Mercado | Razón | Análisis |
|------|---------|---------|-----------|------------|--------------|--------|----------|
[Tabla completa con al menos 8 activos Micro Cap]

#### 🏆 Top Performers 30 Días:
| Rank | Símbolo | Nombre | Cambio 30d | Cambio 7d | Cap. Mercado | Razón | Análisis |
|------|---------|---------|------------|-----------|--------------|--------|----------|
[Tabla completa con al menos 8 activos Micro Cap]

### 🏭 Análisis Sectorial Micro Caps:
- **Experimental DeFi**: [Análisis de protocolos DeFi experimentales]
- **New Gaming**: [Análisis de nuevos tokens gaming]
- **Meme Coins**: [Análisis de meme coins emergentes]
- **Niche Utilities**: [Análisis de tokens de utilidad específica]
- **Early Stage**: [Análisis de proyectos en etapa temprana]

### 📊 Scoring Detallado Micro Caps:
| Símbolo | Nombre | Precio | Score Inversión | Score Riesgo | Score Liquidez | Recomendación |
|---------|---------|--------|----------------|-------------|----------------|---------------|
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |
| [SYM] | [Nombre] | $X | X/10 | X/10 | X/5 | Acción específica |

### 💎 Must-Take Messages - Micro Caps:
• **[ACTIVO 1]**: [Razón específica con contexto de alto riesgo/alto retorno]
• **[ACTIVO 2]**: [Razón específica con contexto de alto riesgo/alto retorno]
• **[ACTIVO 3]**: [Razón específica con contexto de alto riesgo/alto retorno]
• **[ACTIVO 4]**: [Razón específica con contexto de alto riesgo/alto retorno]
• **[ACTIVO 5]**: [Razón específica con contexto de alto riesgo/alto retorno]

### 🎯 Estrategias Granulares Micro Caps:
| Activo | Entrada | Trigger | Salida | SL | R:R | Timeframe | Estrategia |
|--------|---------|---------|--------|----|-----|-----------|------------|
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |
| [SYM] | $X-$X | Condición técnica específica | $X-$X | $X | X:X | X días/semanas | Descripción |

### 🔍 Consideraciones Técnicas Micro Caps:
- **Patrón Chartista Dominante**: [Descripción específica del patrón]
- **Riesgos de Liquidez Extremos**: [Análisis específico de liquidez]
- **Volatilidad Extrema**: [Análisis de volatilidad y riesgos]
- **Niveles Críticos**: [Niveles clave para principales activos]
- **Análisis de Momentum**: [Patrones de momentum y especulación]

### ⚠️ Advertencias Específicas Micro Caps:
- **Riesgo de Liquidez**: [Descripción específica de riesgos]
- **Volatilidad Extrema**: [Análisis de volatilidad]
- **Riesgo de Manipulación**: [Advertencias sobre manipulación]
- **Due Diligence**: [Recomendaciones específicas de investigación]

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

## 🔍 Consideraciones Técnicas Específicas

### Análisis Chartista General:
- **Patrón de Mercado Dominante**: [Descripción del patrón]
- **Fase del Ciclo Técnico**: [Acumulación/Distribución/Tendencia]
- **Correlación BTC/ETH**: [Nivel y implicaciones]
- **Divergencias Principales**: [RSI, MACD, Volume]

### Indicadores Técnicos Clave:
- **RSI del Mercado**: [Valor y interpretación]
- **MACD Composite**: [Señal y momentum]
- **Medias Móviles**: [20, 50, 200 DMA status]
- **Bandas de Bollinger**: [Expansión/Contracción]

### Niveles Críticos de Mercado:
- **Soporte de Mercado**: [Nivel de capitalización]
- **Resistencia de Mercado**: [Nivel de capitalización]
- **Zona de Acumulación**: [Rango de precios]
- **Zona de Distribución**: [Rango de precios]

## 📊 Matrices de Riesgo y Performance

### Matriz de Riesgo-Retorno:
| Categoría | Riesgo | Retorno Esperado | Activos Recomendados | Asignación Sugerida |
|-----------|--------|------------------|---------------------|---------------------|
| Bajo Riesgo | Bajo | Moderado | [Lista] | [%] |
| Riesgo Moderado | Medio | Alto | [Lista] | [%] |
| Alto Riesgo | Alto | Muy Alto | [Lista] | [%] |

### Matriz de Performance Cualitativa:
| Símbolo | Potencial | Riesgo | Liquidez | Recomendación |
|---------|-----------|--------|----------|---------------|
| [SYM] | [Alto/Medio/Bajo] | [Alto/Medio/Bajo] | [Alta/Media/Baja] | [Acción específica] |
| [SYM] | [Alto/Medio/Bajo] | [Alto/Medio/Bajo] | [Alta/Media/Baja] | [Acción específica] |

### Análisis de Correlaciones:
- Correlación con Bitcoin
- Correlación con mercados tradicionales
- Correlación entre sectores crypto

## 🎯 Ideas de Trading Accionables

### Estrategias de Corto Plazo (1-7 días):
1. **[Nombre de Estrategia]**
   - Activos objetivo: [Lista]
   - Puntos de entrada: [Precios específicos]
   - Objetivos: [Niveles específicos]
   - Stop Loss: [Niveles específicos]
   - Ratio Riesgo/Beneficio: [Ratio específico]
   - Triggers: [Condiciones técnicas específicas]

2. **[Nombre de Estrategia]**
   - [Detalles similares con especificidad]

### Estrategias de Medio Plazo (1-4 semanas):
1. **[Nombre de Estrategia]**
   - [Detalles completos con niveles específicos]

### Estrategias de Largo Plazo (1-6 meses):
1. **[Nombre de Estrategia]**
   - [Detalles completos con niveles específicos]

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
[Lista detallada con rationale y niveles de entrada]

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
[Lista detallada con rationale y niveles de entrada]

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
[Lista detallada con rationale y niveles de entrada]

## 🔮 Conclusiones y Perspectivas de Mercado

### Fase Actual del Mercado:
- Clasificación del ciclo de mercado
- Comparación con ciclos anteriores
- Indicadores de cambio de fase

### Principales Takeaways:
1. [Punto clave 1 con explicación específica]
2. [Punto clave 2 con explicación específica]
3. [Punto clave 3 con explicación específica]
4. [Punto clave 4 con explicación específica]
5. [Punto clave 5 con explicación específica]

### Escenarios Prospectivos:
- **Escenario Base (60% probabilidad)**: [Descripción con niveles específicos]
- **Escenario Optimista (25% probabilidad)**: [Descripción con niveles específicos]
- **Escenario Pesimista (15% probabilidad)**: [Descripción con niveles específicos]

### Factores de Riesgo a Monitorear:
- Riesgos macroeconómicos
- Riesgos regulatorios
- Riesgos técnicos/tecnológicos
- Riesgos de liquidez

### Recomendaciones Finales:
- Estrategia general recomendada
- Niveles de entrada y salida específicos
- Gestión de riesgo con stops específicos
- Frecuencia de rebalanceo

---

**Disclaimer**: Este análisis es únicamente para fines informativos y educativos. No constituye asesoramiento financiero, de inversión o de trading. Las criptomonedas son activos altamente volátiles y especulativos. Siempre realice su propia investigación y consulte con un asesor financiero calificado antes de tomar decisiones de inversión.

**INSTRUCCIONES CRÍTICAS PARA EL ANÁLISIS:**
1. **SÉ ESPECÍFICO**: Incluye precios exactos, niveles técnicos específicos, y ratios precisos
2. **USA DATOS REALES**: Basa todos los análisis en los datos proporcionados
3. **COMPLETA TODAS LAS TABLAS**: No dejes ninguna tabla vacía o incompleta
4. **INCLUYE SCORING**: Asigna scores numéricos específicos a cada activo
5. **MUST-TAKE MESSAGES**: Identifica 3-5 oportunidades destacadas por grupo
6. **NIVELES TÉCNICOS**: Proporciona niveles específicos de soporte/resistencia
7. **ESTRATEGIAS GRANULARES**: Incluye puntos de entrada, salida y stop loss específicos
8. **ANÁLISIS SECTORIAL**: Evalúa cada sector dentro de cada grupo de capitalización
9. **LONGITUD MÍNIMA**: El análisis debe tener al menos 500 líneas de contenido detallado
10. **FORMATO PROFESIONAL**: Mantén el formato de tabla exacto y la estructura profesional
`;

export const analyzeCryptoData = async (prompt: string): Promise<string> => {
  const genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.5-flash", // Usando Gemini 2.5 Flash correcto
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 32768, // Aumentado significativamente para análisis completos
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
