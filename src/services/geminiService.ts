// src/services/geminiService.ts
import { CryptoData } from '../types';
import { performPreAnalysis } from '../utils/preAnalysis';

export const generateAnalysisWithGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:3001/api/generate-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }
    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Error al generar el análisis:", error);
    return "Error: No se pudo generar el análisis.";
  }
};

// Nueva función de análisis que pre-procesa los datos
export const analyzeCryptoData = async (cryptoDataJson: string): Promise<string> => {
  try {
    const cryptoData: CryptoData[] = JSON.parse(cryptoDataJson);
    
    // 1. Realizar el pre-análisis para obtener datos calculados
    const preAnalysisResult = performPreAnalysis(cryptoData);

    // 2. Construir el prompt para que Gemini interprete los datos
    const finalPrompt = `
Eres un analista experto en criptomonedas con años de experiencia en mercados financieros. Te he proporcionado datos completos del mercado de criptomonedas que debes analizar de manera exhaustiva y profesional.

INSTRUCCIONES ESPECÍFICAS:
1. Analiza profundamente los datos proporcionados
2. Redacta un reporte completo y detallado (mínimo 3000 palabras)
3. Incluye análisis técnico, fundamental y de sentiment
4. Proporciona insights accionables y recomendaciones específicas
5. Usa un tono profesional pero accesible
6. Incluye análisis de riesgo y oportunidades

--- DATOS DEL MERCADO ---

# 📊 Análisis Integral de Mercado de Criptomonedas

## 🔼 Top Performers por Período

### Última Hora (1h)
${preAnalysisResult.topPerformers1h}

### Últimas 24 Horas
${preAnalysisResult.topPerformers24h}

### Última Semana (7d)
${preAnalysisResult.topPerformers7d}

### Último Mes (30d)
${preAnalysisResult.topPerformers30d}

${preAnalysisResult.marketCapAnalysis}

--- ESTRUCTURA DEL REPORTE ---

Basándote en los datos anteriores, redacta un reporte completo que incluya:

## 📈 Executive Summary
Análisis del estado general del mercado, tendencias dominantes, nivel de riesgo actual y puntos clave para inversores. Incluye tu evaluación del sentiment del mercado y las principales fuerzas que están impulsando los precios.

## 🎯 Dashboard de Métricas Clave
Calcula y presenta métricas importantes como volatilidad promedio, distribución de ganancias/pérdidas, concentración de mercado, y análisis de correlaciones entre los diferentes grupos de capitalización.

## 🏢 Análisis Sectorial Detallado
Examina el rendimiento de diferentes sectores (DeFi, Layer 1, Layer 2, NFTs, Gaming, etc.) identificando patrones y oportunidades específicas.

## 💡 Ideas de Trading y Estrategias
Proporciona estrategias específicas basadas en los datos, incluyendo:
- Oportunidades de swing trading
- Inversiones a largo plazo
- Gestión de riesgo
- Niveles técnicos clave

## ⚠️ Análisis de Riesgo
Evalúa los riesgos actuales del mercado, incluyendo volatilidad, correlaciones, y factores macro que podrían afectar el mercado.

## 🔮 Proyecciones y Conclusiones
Ofrece perspectivas fundamentadas sobre la dirección probable del mercado en diferentes horizontes temporales.

IMPORTANTE: Este debe ser un análisis completo y detallado que demuestre expertise real en el análisis de criptomonedas. No uses plantillas genéricas.
`;
    
    // 3. Realizar una única llamada a Gemini
    const finalAnalysis = await generateAnalysisWithGemini(finalPrompt);
    
    return finalAnalysis;
    
  } catch (error) {
    console.error("Error en analyzeCryptoData:", error);
    throw error;
  }
};
