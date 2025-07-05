// src/services/geminiService.ts - Análisis IA mejorado

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CryptoData } from '../types';

const GEMINI_API_KEY = (import.meta.env?.VITE_GEMINI_API_KEY as string) || 'TU_CLAVE_AQUI';

let genAI: GoogleGenerativeAI | null = null;

const initializeGemini = () => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'TU_CLAVE_AQUI') {
    throw new Error('API Key de Gemini no configurada. Revisa el archivo .env');
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  
  return genAI;
};

// 🧠 PROMPT MEJORADO: Más estructurado y específico
const createAdvancedAnalysisPrompt = (cryptoData: CryptoData[]): string => {
  // Preparar estadísticas del mercado
  const validData = cryptoData.filter(coin => 
    coin.price_change_percentage_24h !== null && 
    coin.total_volume !== null &&
    coin.market_cap !== null
  );

  // Calcular métricas del mercado
  const totalMarketCap = validData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const totalVolume = validData.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  
  // Top performers
  const top5Gainers = [...validData]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 5);
    
  const top5Losers = [...validData]
    .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
    .slice(0, 5);
    
  // Distribución de tendencias
  const positiveCoins = validData.filter(coin => (coin.price_change_percentage_24h || 0) > 0);
  const negativeCoins = validData.filter(coin => (coin.price_change_percentage_24h || 0) < 0);
  const neutralCoins = validData.filter(coin => (coin.price_change_percentage_24h || 0) === 0);

  // Análisis de volumen
  const highVolumeCoins = validData.filter(coin => (coin.total_volume || 0) > 100_000_000);
  const avgVolume = totalVolume / validData.length;

  return `Eres un analista profesional de criptomonedas. Analiza los siguientes datos del mercado y genera un reporte profesional y detallado en español.

**DATOS DEL MERCADO (${validData.length} criptomonedas analizadas):**

**Métricas Generales:**
- Capitalización total del mercado: $${(totalMarketCap / 1_000_000_000_000).toFixed(2)}T
- Volumen total 24h: $${(totalVolume / 1_000_000_000).toFixed(1)}B
- Volumen promedio por activo: $${(avgVolume / 1_000_000).toFixed(1)}M

**Distribución de Tendencias 24h:**
- Activos en verde: ${positiveCoins.length} (${((positiveCoins.length / validData.length) * 100).toFixed(1)}%)
- Activos en rojo: ${negativeCoins.length} (${((negativeCoins.length / validData.length) * 100).toFixed(1)}%)
- Activos neutrales: ${neutralCoins.length} (${((neutralCoins.length / validData.length) * 100).toFixed(1)}%)

**Top 5 Mejores Rendimientos 24h:**
${top5Gainers.map((coin, idx) => 
  `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}): +${coin.price_change_percentage_24h?.toFixed(2)}%`
).join('\n')}

**Top 5 Peores Rendimientos 24h:**
${top5Losers.map((coin, idx) => 
  `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}): ${coin.price_change_percentage_24h?.toFixed(2)}%`
).join('\n')}

**Actividad de Trading:**
- Activos con alto volumen (>$100M): ${highVolumeCoins.length}
- Bitcoin: ${cryptoData.find(c => c.symbol === 'btc')?.price_change_percentage_24h?.toFixed(2) || 'N/A'}% (24h)
- Ethereum: ${cryptoData.find(c => c.symbol === 'eth')?.price_change_percentage_24h?.toFixed(2) || 'N/A'}% (24h)

**INSTRUCCIONES PARA EL ANÁLISIS:**

Genera un reporte profesional siguiendo EXACTAMENTE esta estructura:

# 📊 ANÁLISIS PROFESIONAL DEL MERCADO CRYPTO
*Fecha: ${new Date().toLocaleDateString('es-ES', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}*

## 🔍 RESUMEN EJECUTIVO
[Párrafo de 3-4 líneas que resuma la situación general del mercado, el sentimiento predominante y las principales tendencias observadas]

## 📈 ANÁLISIS DE TENDENCIAS

### Rendimiento General 24h
- **Sentimiento del mercado:** [Alcista/Bajista/Lateral]
- **Distribución:** ${positiveCoins.length} activos en verde vs ${negativeCoins.length} en rojo
- **Interpretación:** [Análisis del balance entre activos positivos y negativos]

### Líderes del Mercado
**🚀 Mejores Performers:**
[Analizar los top 5 ganadores, mencionar sectores o narrativas comunes]

**📉 Mayores Caídas:**
[Analizar los top 5 perdedores, identificar patrones o razones posibles]

## 💰 ANÁLISIS DE VOLUMEN Y LIQUIDEZ

- **Volumen total:** $${(totalVolume / 1_000_000_000).toFixed(1)}B (24h)
- **Concentración:** [Comentar si el volumen está concentrado en pocos activos o distribuido]
- **Liquidez:** [Evaluar la liquidez general del mercado basándose en el volumen]

## 🏢 ANÁLISIS SECTORIAL
[Identificar tendencias por sectores: DeFi, Layer 1, Layer 2, Memes, AI, etc. Basarse en los datos proporcionados]

## ⚠️ FACTORES DE RIESGO Y OPORTUNIDADES

### Riesgos Identificados:
- [Listar 2-3 riesgos basados en los datos]

### Oportunidades:
- [Listar 2-3 oportunidades basadas en los datos]

## 🎯 CONCLUSIONES Y PERSPECTIVAS

[Párrafo final con conclusiones clave y perspectiva para las próximas 24-48 horas]

---

**IMPORTANTE:**
- Usa DATOS REALES de la información proporcionada
- Sé específico con nombres de criptomonedas y porcentajes
- Mantén un tono profesional pero accesible
- NO inventes datos que no están en la información proporcionada
- Incluye emojis para mejorar la legibilidad
- Formatea usando Markdown para una mejor presentación`;
};

export const analyzeCryptoData = async (cryptoData: CryptoData[]): Promise<string> => {
  try {
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 8192, // ✅ Aumentado para respuestas más largas
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      }
    });

    const prompt = createAdvancedAnalysisPrompt(cryptoData);
    
    console.log('🤖 Enviando prompt a Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    if (!analysisText || analysisText.trim().length < 100) {
      throw new Error('La respuesta de IA fue demasiado corta o vacía');
    }

    console.log('✅ Análisis generado exitosamente');
    return analysisText;

  } catch (error: any) {
    console.error('❌ Error en el análisis de IA:', error);
    
    // Manejo específico de errores
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Clave de API de Gemini inválida. Verifica tu configuración.');
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error('Cuota de Gemini excedida. Espera unos minutos o usa otra clave.');
    } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
      throw new Error('Límite de velocidad excedido. Espera unos segundos y reintenta.');
    } else {
      throw new Error(`Error al generar análisis: ${error.message || 'Error desconocido'}`);
    }
  }
};

// 🔄 Función auxiliar para reintentar en caso de error temporal
export const analyzeCryptoDataWithRetry = async (
  cryptoData: CryptoData[], 
  maxRetries: number = 3
): Promise<string> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Intento ${attempt} de ${maxRetries}...`);
      return await analyzeCryptoData(cryptoData);
    } catch (error: any) {
      lastError = error;
      
      // No reintentar errores permanentes
      if (error.message?.includes('API_KEY_INVALID') || 
          error.message?.includes('QUOTA_EXCEEDED')) {
        throw error;
      }
      
      // Esperar antes del siguiente intento
      if (attempt < maxRetries) {
        const waitTime = attempt * 2000; // 2s, 4s, 6s...
        console.log(`⏳ Esperando ${waitTime/1000}s antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError!;
};

// Exportación para compatibilidad con versiones anteriores
export const generateAnalysisWithGemini = analyzeCryptoDataWithRetry;

// Función wrapper para análisis basado en prompt de texto
export const generateAnalysisFromPrompt = async (prompt: string): Promise<string> => {
  // Para análisis basado en prompt de texto, crear datos dummy o usar análisis general
  // En un caso real, aquí se podría parsear el prompt para extraer información específica
  return `# Análisis Basado en Prompt\n\n**Prompt recibido:** ${prompt}\n\n*Nota: Esta es una implementación temporal. En la versión completa, el análisis se basará en datos reales del mercado.*\n\n## Características implementadas:\n\n- ✅ Tipos TypeScript actualizados con 250+ interfaces\n- ✅ Cambio crítico: Heatmaps de 1000 elementos (previamente 50)\n- ✅ Navegación por pestañas profesional\n- ✅ Componentes de vista preparados para análisis sectorial\n- ✅ Integración CSV para categorías de criptomonedas\n- ✅ Servicio Gemini configurado para análisis IA\n\n## Próximos pasos:\n\n- 🔄 Implementar análisis real con datos de mercado\n- 🎨 Gradientes RGB profesionales para heatmaps\n- 📊 Análisis sectorial dinámico\n- 🤖 Integración completa con API de Gemini`;
};
