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

const createAdvancedAnalysisPrompt = (cryptoData: CryptoData[]): string => {
  // Preparar estadísticas del mercado
  const validData = cryptoData.filter(coin => 
    coin.price_change_percentage_24h !== null && 
    coin.total_volume !== null &&
    coin.market_cap !== null
  );

  const getTopPerformers = (data: CryptoData[], criteria: keyof CryptoData, order: 'asc' | 'desc', count: number) => {
    return [...data]
      .filter(coin => coin[criteria] !== null && coin[criteria] !== undefined)
      .sort((a, b) => {
        const valA = a[criteria] as number;
        const valB = b[criteria] as number;
        return order === 'asc' ? valA - valB : valB - valA;
      })
      .slice(0, count);
  };

  const formatTopList = (coins: CryptoData[], metricField: keyof CryptoData, emoji: string) => {
    if (coins.length === 0) return 'No data available.\n';
    return coins.map((coin, idx) => `${idx + 1}. **${coin.name}** (${coin.symbol.toUpperCase()}) ${emoji} ${((coin[metricField] || 0) as number).toFixed(2)}%`).join('\n');
  };

  const top1h = getTopPerformers(validData, 'price_change_percentage_1h_in_currency', 'desc', 10);
  const top24h = getTopPerformers(validData, 'price_change_percentage_24h', 'desc', 10);
  const top7d = getTopPerformers(validData, 'price_change_percentage_7d_in_currency', 'desc', 10);
  const top30d = getTopPerformers(validData, 'price_change_percentage_30d_in_currency', 'desc', 10);

  const dataSummary = `
### 🔼 Top 10 - Última Hora (1h)
${formatTopList(top1h, 'price_change_percentage_1h_in_currency', '🔼')}

### 🔼 Top 10 - Últimas 24 Horas
${formatTopList(top24h, 'price_change_percentage_24h', '🟢')}

### 🔼 Top 10 - Última Semana (7d)
${formatTopList(top7d, 'price_change_percentage_7d_in_currency', '🟢')}

### 🔼 Top 10 - Último Mes (30d)
${formatTopList(top30d, 'price_change_percentage_30d_in_currency', '🟢')}
`;

  return `Eres un analista experto de criptomonedas de nivel institucional. Tu tarea es generar un informe de mercado detallado, perspicaz y profesional en **español**, basándote **EXCLUSIVAMENTE** en los datos que se te proporcionan.

**Instrucción Principal:** Rellena la siguiente plantilla de informe. Sigue la estructura y las instrucciones entre corchetes [INSTRUCCIÓN: ...] de forma rigurosa. Adopta el tono y estilo del ejemplo de "Executive Summary" que se te proporciona. No inventes datos que no se puedan derivar de la información de entrada.

---
### EJEMPLO DE ESTILO Y TONO (Para el Executive Summary)
*El mercado de criptomonedas se encuentra en una fase de consolidación y corrección a corto plazo, evidenciada por el hecho de que solo el 15.4% de los activos han experimentado ganancias en las últimas 24 horas. Sin embargo, el panorama a medio plazo muestra una resiliencia notable, con un 65.0% de las criptomonedas al alza en las últimas 7 días, lo que sugiere que las caídas recientes podrían ser una oportunidad de compra para los inversores con una perspectiva a más largo plazo. La capitalización total del mercado se mantiene robusta en $3.22 billones, con Bitcoin (BTC) y Ethereum (ETH) dominando la liquidez y la capitalización.*
---

**DATOS DE MERCADO PARA TU ANÁLISIS:**
${dataSummary}
**Total de criptomonedas analizadas:** ${validData.length}
**Datos completos (primeros 5 para referencia):**
${JSON.stringify(validData.slice(0, 5), null, 2)}

---
**PLANTILLA DE INFORME A RELLENAR:**

# 📊 Análisis Integral de Mercado de Criptomonedas

## 📈 Executive Summary
[INSTRUCCIÓN: Escribir 4-5 párrafos sobre:
- Estado general del mercado y sentimiento
- Capitalización total y dominancia BTC (si se puede calcular)
- Tendencias principales observadas en los datos de Top Performers
- Nivel de riesgo actual inferido de la volatilidad
- Puntos clave más importantes
- Recomendación general de posicionamiento]

## 🎯 Dashboard de Métricas Clave
[INSTRUCCIÓN: Rellena los siguientes puntos basándote en los datos. Si un dato no se puede calcular, indícalo como "No disponible".]
### Indicadores Principales:
- **Capitalización Total del Mercado**: [Calcula la suma de market_cap]
- **Dominancia de Bitcoin**: [Calcula (BTC market_cap / Total market_cap) * 100, si BTC está en los datos]
- **Índice de Miedo y Codicia**: [Infiere un estado (ej. Miedo, Neutral, Codicia) basado en la proporción de activos al alza vs a la baja en 24h y 7d]
- **Volumen Total 24h**: [Calcula la suma de total_volume]
- **Número de Activos en Tendencia Alcista**: [Calcula el número de activos con cambio > 0 en 24h y 7d y su porcentaje]

### Métricas de Volatilidad:
- **Volatilidad Promedio 24h**: [Describe si es alta o baja y menciona el activo más volátil del top 10 de 24h]
- **Correlación con Mercados Tradicionales**: [Indica "No disponible con los datos actuales"]

## 🏢 Análisis por Grupos de Capitalización
[INSTRUCCIÓN: Esta sección requiere un análisis más profundo. Si es muy complejo, puedes indicar "Análisis detallado por capitalización no implementado en esta versión". De lo contrario, intenta agrupar los 20 primeros activos por market cap y analiza su tendencia general.]

## 💎 Must-Take Messages
[INSTRUCCIÓN: Lista 5-7 mensajes clave o takeaways basados en los datos de los Top Performers. Por ejemplo: "El token X muestra un momentum excepcional en el último mes, indicando un fuerte interés especulativo." o "El sector Y parece estar en una fase de corrección, como lo demuestra la presencia de varios de sus tokens en las listas de peores rendimientos (si estuvieran disponibles)."]

## ⚠️ Observaciones Clave y Alertas
[INSTRUCCIÓN: Identifica cualquier patrón o anomalía en los datos. Por ejemplo, si un mismo token aparece en el top de 1h, 24h y 7d, es una observación clave sobre su momentum. Si un token tiene un cambio de precio enorme pero un volumen muy bajo, es una alerta de posible baja liquidez o manipulación.]

## 🔮 Conclusiones y Perspectivas de Mercado
[INSTRUCCIÓN: Ofrece una conclusión final sobre la fase actual del mercado y qué podrían esperar los inversores en los próximos días basándote estrictamente en los datos de rendimiento proporcionados.]

---
**Disclaimer**: Este análisis es únicamente para fines informativos y educativos. No constituye asesoramiento financiero.
`;
};

export const analyzeCryptoData = async (cryptoData: CryptoData[]): Promise<string> => {
  try {
    const ai = initializeGemini();
    const model = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest', // Changed to gemini-1.5-flash-latest
      generationConfig: {
        maxOutputTokens: 32768, // Changed to 32768
        temperature: 0.8, // Changed to 0.8
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