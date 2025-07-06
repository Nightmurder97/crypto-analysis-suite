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
  
  // Top performers (top5Gainers, top5Losers) son ahora calculados por getTopPerformers y usados en formatTable
  // No se necesitan estas variables separadas.
    
  // Distribución de tendencias
  const NUM_ITEMS_FOR_TABLES = 5; // Number of items for Top/Worst performers tables

  // Helper function to sort and slice data for tables
  const getTopPerformers = (criteria: keyof CryptoData, order: 'asc' | 'desc', count: number) => {
    return [...validData]
      .filter(coin => coin[criteria] !== null && coin[criteria] !== undefined)
      .sort((a, b) => {
        const valA = a[criteria] as number;
        const valB = b[criteria] as number;
        return order === 'asc' ? valA - valB : valB - valA;
      })
      .slice(0, count);
  };

  const formatTable = (title: string, coins: CryptoData[], metricField: keyof CryptoData, isPercentage: boolean = true) => {
    if (coins.length === 0) return `${title}:\nNo data available.\n`;
    let table = `${title}:\n`;
    table += `| Ranking | Nombre | Símbolo | % Cambio | Precio | Market Cap | Volumen 24h |\n`;
    table += `|:--------|:-------|:--------|:---------|:-------|:-----------|:------------|\n`;
    coins.forEach((coin, idx) => {
        const metricValue = coin[metricField];
        const displayMetric = typeof metricValue === 'number' ? (isPercentage ? `${metricValue.toFixed(2)}%` : metricValue) : 'N/A';
        table += `| ${coin.market_cap_rank || idx + 1} | ${coin.name} | ${coin.symbol.toUpperCase()} | ${isPercentage ? ( (metricValue || 0) > 0 ? '🟢 ' : '🔻 ') : ''}${displayMetric} | ${coin.current_price?.toLocaleString() || 'N/A'} | ${coin.market_cap?.toLocaleString() || 'N/A'} | ${coin.total_volume?.toLocaleString() || 'N/A'} |\n`;
    });
    return table + '\n';
  };

  // Prepare data for the prompt
  const totalMarketCap = validData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const totalVolume = validData.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);

  const assetsUp24h = validData.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
  const assetsDown24h = validData.filter(c => (c.price_change_percentage_24h || 0) < 0).length;
  const assetsNeutral24h = validData.length - assetsUp24h - assetsDown24h;

  const assetsUp30d = validData.filter(c => (c.price_change_percentage_30d_in_currency || 0) > 0).length;
  const assetsDown30d = validData.filter(c => (c.price_change_percentage_30d_in_currency || 0) < 0).length;
  const assetsNeutral30d = validData.length - assetsUp30d - assetsDown30d;

  const mostVolatile24h = getTopPerformers('price_change_percentage_24h', 'desc', NUM_ITEMS_FOR_TABLES)
    .map(c => `${c.name} (${Math.abs(c.price_change_percentage_24h || 0).toFixed(2)}%)`)
    .join(', ');

  const highestLiquidity = getTopPerformers('total_volume', 'desc', NUM_ITEMS_FOR_TABLES)
    .map(c => `${c.name} ($${(c.total_volume || 0).toLocaleString()})`)
    .join(', ');

  // Data for tables
  const best24h = getTopPerformers('price_change_percentage_24h', 'desc', NUM_ITEMS_FOR_TABLES);
  const worst24h = getTopPerformers('price_change_percentage_24h', 'asc', NUM_ITEMS_FOR_TABLES);
  const best7d = getTopPerformers('price_change_percentage_7d_in_currency', 'desc', NUM_ITEMS_FOR_TABLES);
  const worst7d = getTopPerformers('price_change_percentage_7d_in_currency', 'asc', NUM_ITEMS_FOR_TABLES);
  const best30d = getTopPerformers('price_change_percentage_30d_in_currency', 'desc', NUM_ITEMS_FOR_TABLES);
  const worst30d = getTopPerformers('price_change_percentage_30d_in_currency', 'asc', NUM_ITEMS_FOR_TABLES);

  const topVolume = getTopPerformers('total_volume', 'desc', NUM_ITEMS_FOR_TABLES);
  const topMarketCap = getTopPerformers('market_cap', 'desc', NUM_ITEMS_FOR_TABLES);

  // Construct the prompt string
  // This is a simplified version. A more dynamic approach would be better for complex data.
  const dataSummary = `
**DATOS DEL MERCADO (${validData.length} criptomonedas analizadas):**

**Métricas Generales:**
- Capitalización total del mercado: $${totalMarketCap.toLocaleString()}
- Volumen total 24h: $${totalVolume.toLocaleString()}

**Dashboard de Métricas Clave:**
*   Market Cap Total: $${totalMarketCap.toLocaleString()}
*   Activos al Alza (últimas 24h): ${assetsUp24h} 🟢
*   Activos a la Baja (últimas 24h): ${assetsDown24h} 🔻
*   Activos Sin Cambio (últimas 24h): ${assetsNeutral24h}
*   Activos al Alza (últimos 30d): ${assetsUp30d} 🟢
*   Activos a la Baja (últimos 30d): ${assetsDown30d} 🔻
*   Activos Sin Cambio (últimos 30d): ${assetsNeutral30d}
*   Activos más Volátiles (24h, indicativo): ${mostVolatile24h || 'N/A'}
*   Activos con Mayor Liquidez (24h): ${highestLiquidity || 'N/A'}

${formatTable('Mejores Rendimientos (Últimas 24 horas)', best24h, 'price_change_percentage_24h')}
${formatTable('Peores Rendimientos (Últimas 24 horas)', worst24h, 'price_change_percentage_24h')}
${formatTable('Mejores Rendimientos (Últimos 7 días)', best7d, 'price_change_percentage_7d_in_currency')}
${formatTable('Peores Rendimientos (Últimos 7 días)', worst7d, 'price_change_percentage_7d_in_currency')}
${formatTable('Mejores Rendimientos (Últimos 30 días)', best30d, 'price_change_percentage_30d_in_currency')}
${formatTable('Peores Rendimientos (Últimos 30 días)', worst30d, 'price_change_percentage_30d_in_currency')}

${formatTable('Top 5 por Volumen 24h', topVolume, 'total_volume', false)}
${formatTable('Top 5 por Market Cap', topMarketCap, 'market_cap', false)}
`;

  return `Eres un analista experto de criptomonedas de nivel institucional. Tu tarea es generar un informe de mercado detallado, perspicaz y profesional en **español**.
Utiliza **EXCLUSIVAMENTE** los datos pre-procesados que se proporcionan a continuación. No inventes ni alucines datos.
El informe debe seguir rigurosamente la siguiente estructura y mantener un tono formal y analítico, utilizando emojis para mejorar la legibilidad y tablas en formato Markdown cuando se indique.

${dataSummary}

**INSTRUCCIONES PARA EL INFORME:**

# 🪙 INFORME DE MERCADO DE CRIPTOMONEDAS
*Fecha del Análisis: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date().toLocaleTimeString('es-ES')}*

##  EXECUTIVE SUMMARY
[Proporciona un resumen conciso (4-5 líneas) del comportamiento del mercado, destacando tendencias clave, sentimiento general y cualquier movimiento significativo observado en los datos proporcionados.]

## DASHBOARD DE MÉTRICAS CLAVE
[Esta sección ya está incluida en los datos de entrada. Puedes referenciarla o resumirla brevemente si es necesario, pero enfócate en el análisis.]

## Tendencias Generales del Grupo
[Analiza las tendencias generales del mercado basándote en los datos de activos al alza/baja y los rendimientos en 1h, 24h, 7d, 30d. Describe el sentimiento del mercado a corto, medio y largo plazo.]

## Mejores Rendimientos
[Comenta brevemente los activos listados en las tablas de "Mejores Rendimientos". Si identificas patrones (ej. un sector en particular, una narrativa común), menciónalo. No necesitas repetir todos los datos de las tablas.]

## Peores Rendimientos
[Comenta brevemente los activos listados en las tablas de "Peores Rendimientos". Identifica posibles razones o implicaciones si los datos lo sugieren.]

## Top por Volumen y Market Cap
[Analiza la concentración de volumen y capitalización. ¿Qué implica que ciertos activos dominen estas métricas? Comenta la liquidez.]

## Análisis de Volumen
[Profundiza en el análisis del volumen de negociación. ¿Hay algo destacable sobre el volumen total o el volumen de activos específicos? ¿Qué indica sobre la actividad del mercado y la confianza de los inversores?]

## Observaciones Clave
[Presenta 3-4 observaciones cruciales o insights derivados de todos los datos proporcionados. Estas deben ser conclusiones importantes que un inversor debería conocer.]

## Estrategias Recomendadas
[Basándote **estrictamente** en los datos y tendencias observadas, sugiere 2-3 estrategias de trading o inversión. Para cada estrategia, incluye:
*   **Fundamento:** ¿Por qué esta estrategia? (basado en datos)
*   **Activos Potenciales:** (si aplica, de los datos)
*   **Entrada Sugerida:** (conceptual, ej. "tras confirmación de X")
*   **Trigger:** (ej. "RSI saliendo de sobreventa")
*   **Salida (Take Profit):** (conceptual)
*   **Stop Loss:** (conceptual)
*   **Riesgos:**
No inventes niveles de precios específicos si no están en los datos.]

## Matriz de Performance Ajustada a Riesgo
[Crea una tabla Markdown similar a la del ejemplo, evaluando 5-7 activos destacados de los datos. Las columnas deben ser: "Activo Destacado", "Retorno (30D)", "Volatilidad (Implied)", "Liquidez (Volumen/MCap)", "Recomendación", "Scoring Inversión (1-10)", "Scoring Riesgo (1-10)", "Scoring Liquidez (1-10)". La Volatilidad Implied y los Scorings serán tu evaluación cualitativa basada en los datos.]
Ejemplo de tabla:
| Activo Destacado | Retorno (30D) | Volatilidad (Implied) | Liquidez (Volumen/MCap) | Recomendación | Scoring Inversión | Scoring Riesgo | Scoring Liquidez |
|:-----------------|:--------------|:----------------------|:------------------------|:---------------|:-----------------|:---------------|:-----------------|
| Bitcoin (BTC)    | 🟢 Bajo (+X.X%) | Baja                  | Muy Alta (0.XXX)        | Hold / Acumular | X/10             | X/10           | X/10             |

## Ideas de Trading Accionables (TOP 3)
[Presenta 3 ideas de trading concretas y accionables basadas en los datos. Para cada una:
*   **Contexto:** Breve descripción.
*   **Acción:** (ej. "Comprar si X consolida por encima de Y")
*   **Objetivo:** (conceptual)
*   **Stop-Loss:** (conceptual)
*   **Horizonte:** (ej. "Intradía", "Corto Plazo")]

## Sugerencias de Asignación de Cartera por Perfil de Riesgo
[Proporciona sugerencias de asignación de cartera (conceptual, usando los activos de los datos) para perfiles Conservador, Moderado y Agresivo. Justifica brevemente.]

## MUST-TAKE MESSAGES
[Lista en formato bullet point los activos más destacados de los datos proporcionados, indicando por qué son notables (ej. "BTC: Volumen | Market Cap. Oportunidad destacada." o "XYZ: Top 30d. Fuerte rendimiento.")]

---
**Recordatorios Finales:**
- El análisis debe ser **objetivo y basado en datos**.
- Utiliza un **lenguaje profesional y claro**.
- Asegúrate de que el informe sea **comprensible y útil** para un inversor.
- **Formato Markdown es esencial.**
- **Incluye emojis relevantes** para mejorar la presentación visual.
- No excedas la longitud máxima de respuesta si es posible, pero prioriza la calidad y completitud del informe según esta estructura.
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
