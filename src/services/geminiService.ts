// src/services/geminiService.ts
// Servicio que usa EXCLUSIVAMENTE datos de la API de CoinGecko (NO CSV)

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  total_volume: number;
  circulating_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_change_percentage?: number;
  atl?: number;
  atl_change_percentage?: number;
}

/**
 * Función principal que genera análisis usando SOLO datos de la API de CoinGecko
 */
export const analyzeCryptoData = async (cryptoData: CryptoData[]): Promise<string> => {
  try {
    console.log('🚀 Iniciando análisis con datos de API de CoinGecko...');
    console.log('📊 Datos recibidos de la API:', cryptoData.length, 'criptomonedas (Objetivo: 1000)');

    // Validar que tenemos datos de la API
    if (!cryptoData || cryptoData.length === 0) {
      throw new Error('No se proporcionaron datos de la API de CoinGecko');
    }

    // Verificar si tenemos las 1000 criptomonedas esperadas
    if (cryptoData.length < 1000) {
      console.warn('⚠️ Se esperaban 1000 criptomonedas pero se recibieron:', cryptoData.length);
    }

    // Procesar datos reales de la API
    const apiDataStructured = processAPIData(cryptoData);

    // Construir prompt con datos reales de la API
    const prompt = buildAPIDataPrompt(apiDataStructured);

    console.log('📤 Enviando análisis basado en API de CoinGecko a Gemini...');

    const response = await fetch('http://localhost:3001/api/generate-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        config: {
          maxOutputTokens: 32768,
          temperature: 0.7,
          topK: 40,
          topP: 0.9
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }

    const data = await response.json();
    const analysis = data.analysis;

    console.log('✅ Análisis completado con datos de API');
    console.log('📊 Activos analizados:', cryptoData.length);

    return analysis;
  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
    return `Error al generar el análisis: ${error instanceof Error ? error.message : 'Error desconocido'}`;
  }
};

/**
 * Procesa los datos reales de la API de CoinGecko
 */
function processAPIData(cryptoData: CryptoData[]) {
  console.log('🔍 Procesando datos de API de CoinGecko...');

  // Filtrar datos válidos de la API
  const validAPIData = cryptoData.filter(coin =>
    coin.current_price != null &&
    coin.market_cap != null &&
    coin.name &&
    coin.symbol &&
    coin.current_price > 0 &&
    coin.market_cap > 0
  );

  console.log('📊 Datos válidos de API:', validAPIData.length, 'de', cryptoData.length);

  // Estadísticas reales de la API
  const totalMarketCap = validAPIData.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = validAPIData.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);

  // Contar activos alcistas/bajistas según API
  const coinsWithChange = validAPIData.filter(coin => coin.price_change_percentage_24h != null);
  const positiveCoins = coinsWithChange.filter(coin => coin.price_change_percentage_24h! > 0);
  const negativeCoins = coinsWithChange.filter(coin => coin.price_change_percentage_24h! < 0);

  // Top performers según datos reales de API
  const top15Winners24h = [...coinsWithChange]
    .sort((a, b) => (b.price_change_percentage_24h! - a.price_change_percentage_24h!))
    .slice(0, 15);

  const top15Losers24h = [...coinsWithChange]
    .sort((a, b) => (a.price_change_percentage_24h! - b.price_change_percentage_24h!))
    .slice(0, 15);

  // Top por volumen según API
  const coinsWithVolume = validAPIData.filter(coin => coin.total_volume && coin.total_volume > 0);
  const top15Volume = [...coinsWithVolume]
    .sort((a, b) => (b.total_volume - a.total_volume))
    .slice(0, 15);

  // Agrupación por capitalización real de API
  const largeCaps = validAPIData.filter(coin => coin.market_cap > 10_000_000_000);
  const midCaps = validAPIData.filter(coin => coin.market_cap > 1_000_000_000 && coin.market_cap <= 10_000_000_000);
  const smallCaps = validAPIData.filter(coin => coin.market_cap > 100_000_000 && coin.market_cap <= 1_000_000_000);
  const microCaps = validAPIData.filter(coin => coin.market_cap <= 100_000_000);

  // Buscar BTC y ETH en datos reales de API
  const btc = validAPIData.find(c => c.symbol.toLowerCase() === 'btc');
  const eth = validAPIData.find(c => c.symbol.toLowerCase() === 'eth');

  // Análisis adicional con datos de API
  const averageChange24h = coinsWithChange.length > 0
    ? coinsWithChange.reduce((sum, coin) => sum + coin.price_change_percentage_24h!, 0) / coinsWithChange.length
    : 0;

  const highVolumeCoins = coinsWithVolume.filter(coin => coin.total_volume > 100_000_000);

  return {
    source: 'CoinGecko API',
    totalAPIData: validAPIData.length,
    totalSubmitted: cryptoData.length,
    coinsWithChangeData: coinsWithChange.length,
    totalMarketCap,
    totalVolume,
    positiveCount: positiveCoins.length,
    negativeCount: negativeCoins.length,
    neutralCount: validAPIData.length - coinsWithChange.length,
    averageChange24h,
    btcData: btc,
    ethData: eth,
    top15Winners24h,
    top15Losers24h,
    top15Volume,
    highVolumeCount: highVolumeCoins.length,
    groupedData: {
      largeCaps,
      midCaps,
      smallCaps,
      microCaps
    },
    allValidData: validAPIData
  };
}

/**
 * Construye prompt usando EXCLUSIVAMENTE datos de la API de CoinGecko
 */
function buildAPIDataPrompt(apiData: any): string {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Formatear datos reales de API para el prompt
  const formatPrice = (price: number) => {
    if (price >= 1) return price.toFixed(2);
    if (price >= 0.01) return price.toFixed(4);
    if (price >= 0.0001) return price.toFixed(6);
    return price.toFixed(8);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(1)}B`;
    if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(1)}M`;
    if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`;
    return `${volume.toFixed(0)}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1_000_000_000) return `${(cap / 1_000_000_000).toFixed(1)}B`;
    if (cap >= 1_000_000) return `${(cap / 1_000_000).toFixed(1)}M`;
    if (cap >= 1_000) return `${(cap / 1_000).toFixed(1)}K`;
    return `${cap.toFixed(0)}`;
  };

  // Crear tablas con datos reales de la API
  const winnersTable = apiData.top15Winners24h.map((coin: any, idx: number) => 
    `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) | ${formatPrice(coin.current_price)} | ${coin.price_change_percentage_24h.toFixed(2)}% | Vol: ${formatVolume(coin.total_volume || 0)} | Cap: ${formatMarketCap(coin.market_cap)} | Rank: #${coin.market_cap_rank || 'N/A'}`
  ).join('\n');

  const losersTable = apiData.top15Losers24h.map((coin: any, idx: number) => 
    `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) | ${formatPrice(coin.current_price)} | ${coin.price_change_percentage_24h.toFixed(2)}% | Vol: ${formatVolume(coin.total_volume || 0)} | Cap: ${formatMarketCap(coin.market_cap)} | Rank: #${coin.market_cap_rank || 'N/A'}`
  ).join('\n');

  const volumeTable = apiData.top15Volume.map((coin: any, idx: number) => 
    `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) | ${formatPrice(coin.current_price)} | Vol: ${formatVolume(coin.total_volume)} | Cap: ${formatMarketCap(coin.market_cap)} | 24h: ${coin.price_change_percentage_24h ? (coin.price_change_percentage_24h >= 0 ? '' : '') + coin.price_change_percentage_24h.toFixed(2) + '%' : 'N/A'}`
  ).join('\n');

  const largeCapsTable = apiData.groupedData.largeCaps.slice(0, 15).map((coin: any, idx: number) => 
    `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) | ${formatPrice(coin.current_price)} | ${coin.price_change_percentage_24h != null ? (coin.price_change_percentage_24h >= 0 ? '' : '') + coin.price_change_percentage_24h.toFixed(2) + '%' : 'N/A'} | Cap: ${formatMarketCap(coin.market_cap)} | Rank: #${coin.market_cap_rank || 'N/A'}`
  ).join('\n');

  const midCapsTable = apiData.groupedData.midCaps.slice(0, 15).map((coin: any, idx: number) => 
    `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) | ${formatPrice(coin.current_price)} | ${coin.price_change_percentage_24h != null ? (coin.price_change_percentage_24h >= 0 ? '' : '') + coin.price_change_percentage_24h.toFixed(2) + '%' : 'N/A'} | Cap: ${formatMarketCap(coin.market_cap)} | Rank: #${coin.market_cap_rank || 'N/A'}`
  ).join('\n');

  const smallCapsTable = apiData.groupedData.smallCaps.slice(0, 15).map((coin: any, idx: number) => 
    `${idx + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) | ${formatPrice(coin.current_price)} | ${coin.price_change_percentage_24h != null ? (coin.price_change_percentage_24h >= 0 ? '' : '') + coin.price_change_percentage_24h.toFixed(2) + '%' : 'N/A'} | Cap: ${formatMarketCap(coin.market_cap)} | Rank: #${coin.market_cap_rank || 'N/A'}`
  ).join('\n');

  return `
ERES UN ANALISTA FINANCIERO EXPERTO EN CRIPTOMONEDAS. Genera un reporte profesional usando EXCLUSIVAMENTE los datos reales de la API de CoinGecko proporcionados.

 INSTRUCCIÓN CRÍTICA: USA SOLO LOS DATOS REALES DE LA API. NO INVENTES INFORMACIÓN.
 ANÁLISIS DE 1000 CRIPTOMONEDAS: Este análisis debe cubrir las 1000 criptomonedas proporcionadas por la aplicación.

=== DATOS REALES DE LA API DE COINGECKO (1000 CRIPTOMONEDAS) ===

ESTADÍSTICAS GENERALES DE LA API:
- Total de criptomonedas enviadas: ${apiData.totalSubmitted} (Objetivo: 1000 criptomonedas)
- Criptomonedas válidas procesadas: ${apiData.totalAPIData}
- Criptomonedas con datos de cambio 24h: ${apiData.coinsWithChangeData}
- Capitalización Total de las procesadas: ${formatMarketCap(apiData.totalMarketCap)}
- Volumen Total 24h: ${formatVolume(apiData.totalVolume)}
- Activos en verde (24h): ${apiData.positiveCount}
- Activos en rojo (24h): ${apiData.negativeCount}
- Activos sin datos de cambio: ${apiData.neutralCount}
- Promedio de cambio 24h: ${apiData.averageChange24h.toFixed(2)}%
- Activos con alto volumen (>$100M): ${apiData.highVolumeCount}

DATOS REALES BTC Y ETH DE LA API:
${apiData.btcData ? `- BTC: ${formatPrice(apiData.btcData.current_price)} | ${apiData.btcData.price_change_percentage_24h != null ? (apiData.btcData.price_change_percentage_24h >= 0 ? '' : '') + apiData.btcData.price_change_percentage_24h.toFixed(2) + '%' : 'Sin datos de cambio'} | Cap: ${formatMarketCap(apiData.btcData.market_cap)} | Vol: ${formatVolume(apiData.btcData.total_volume || 0)} | Rank: #${apiData.btcData.market_cap_rank}` : '- BTC: No encontrado en los datos de la API'}

${apiData.ethData ? `- ETH: ${formatPrice(apiData.ethData.current_price)} | ${apiData.ethData.price_change_percentage_24h != null ? (apiData.ethData.price_change_percentage_24h >= 0 ? '' : '') + apiData.ethData.price_change_percentage_24h.toFixed(2) + '%' : 'Sin datos de cambio'} | Cap: ${formatMarketCap(apiData.ethData.market_cap)} | Vol: ${formatVolume(apiData.ethData.total_volume || 0)} | Rank: #${apiData.ethData.market_cap_rank}` : '- ETH: No encontrado en los datos de la API'}

DISTRIBUCIÓN REAL POR CAPITALIZACIÓN (SEGÚN API):
- Large Caps (>$10B): ${apiData.groupedData.largeCaps.length} activos
- Mid Caps ($1B-$10B): ${apiData.groupedData.midCaps.length} activos
- Small Caps ($100M-$1B): ${apiData.groupedData.smallCaps.length} activos
- Micro Caps (<$100M): ${apiData.groupedData.microCaps.length} activos

=== TOP 15 WINNERS 24H (DATOS REALES DE API) ===
${winnersTable}

=== TOP 15 LOSERS 24H (DATOS REALES DE API) ===
${losersTable}

=== TOP 15 POR VOLUMEN 24H (DATOS REALES DE API) ===
${volumeTable}

=== LARGE CAPS (DATOS REALES DE API) ===
${largeCapsTable}

=== MID CAPS (DATOS REALES DE API) ===
${midCapsTable}

=== SMALL CAPS (DATOS REALES DE API) ===
${smallCapsTable}

 INSTRUCCIONES CRÍTICAS - GENERAR ANÁLISIS COMPLETO:

1. USA EXCLUSIVAMENTE los datos de la API de CoinGecko mostrados arriba
2. NO inventes precios, porcentajes, volúmenes o rankings
3. GENERA UN MÍNIMO DE 500 LÍNEAS DE CONTENIDO PROFESIONAL
4. INCLUYE TODAS LAS SECCIONES OBLIGATORIAS listadas abajo
5. Usa los precios exactos mostrados arriba (respetando los decimales)
6. Para niveles técnicos, calcula basándote en los precios actuales reales
7. Menciona que se analizaron ${apiData.totalSubmitted} activos de CoinGecko
8. Usa  para cambios positivos y  para negativos según los datos
9. Si un dato no está disponible en la API, indica "No disponible en API"
10. COMPLETA TODAS LAS TABLAS sin dejar vacíos

ESTRUCTURA OBLIGATORIA COMPLETA (MÍNIMO 500 LÍNEAS):

#  ANÁLISIS PROFESIONAL DEL MERCADO CRYPTO - 1000 CRIPTOMONEDAS
*Fecha: ${currentDate}*
*Fuente: API de CoinGecko*
*Análisis Objetivo: 1000 criptomonedas*
*Datos Recibidos: ${apiData.totalSubmitted} criptomonedas, ${apiData.totalAPIData} procesadas correctamente*

##  RESUMEN EJECUTIVO
[OBLIGATORIO: 4-5 párrafos detallados sobre la situación general del mercado basándote en las ${apiData.totalAPIData} criptomonedas procesadas de las 1000 objetivo. Incluir análisis del sentimiento predominante, fase del ciclo, nivel de riesgo actual y recomendación de posicionamiento. Mencionar que este análisis representa una muestra significativa del mercado total de criptomonedas.]

##  DASHBOARD DE MÉTRICAS CLAVE

| Métrica | Valor Real (API CoinGecko) | Análisis Detallado |
|---------|---------------------------|-------------------|
| Objetivo de Análisis | 1000 criptomonedas | Análisis comprensivo del mercado crypto |
| Activos Recibidos | ${apiData.totalSubmitted} | Datos obtenidos de CoinGecko API |
| Activos Procesados | ${apiData.totalAPIData} | Activos válidos con datos completos |
| Tasa de Éxito | ${((apiData.totalAPIData / apiData.totalSubmitted) * 100).toFixed(1)}% | Porcentaje de datos válidos procesados |
| Cap. Total (Procesados) | ${formatMarketCap(apiData.totalMarketCap)} | [Interpretación detallada de 2-3 líneas] |
| Volumen 24h Total | ${formatVolume(apiData.totalVolume)} | [Análisis del volumen de 2-3 líneas] |
| Distribución Sentimiento | ${apiData.positiveCount} / ${apiData.negativeCount} / ⚪${apiData.neutralCount} | ${((apiData.positiveCount / apiData.coinsWithChangeData) * 100).toFixed(1)}% alcistas - [Análisis] |
| Promedio Cambio 24h | ${apiData.averageChange24h.toFixed(2)}% | [Interpretación del promedio] |
| Alto Volumen (>$100M) | ${apiData.highVolumeCount} activos | [Análisis de liquidez del mercado] |

##  TECHNICAL LEVELS DASHBOARD

### Bitcoin (BTC) - ${apiData.btcData ? formatPrice(apiData.btcData.current_price) : 'No disponible'}
- **Resistencia Inmediata:** $[Calcular basándote en precio actual + 2-3%]
- **Soporte Inmediata:** $[Calcular basándote en precio actual - 2-3%]
- **RSI:** [Estimar basándote en el cambio 24h] | **MACD:** [Tendencia basándote en cambio]
- **Target Alcista:** $[Precio + 5-8%] | **Target Bajista:** $[Precio - 5-8%]

### Ethereum (ETH) - ${apiData.ethData ? formatPrice(apiData.ethData.current_price) : 'No disponible'}
- **Resistencia Inmediata:** $[Calcular]
- **Soporte Inmediata:** $[Calcular]
- **RSI:** [Estimar] | **MACD:** [Tendencia]
- **Target Alcista:** $[Calcular] | **Target Bajista:** $[Calcular]

### Top 5 Altcoins - Niveles Técnicos
[OBLIGATORIO: Tabla con 5 principales altcoins y sus niveles técnicos calculados]

##  ANÁLISIS POR GRUPOS DE CAPITALIZACIÓN

### ️ LARGE CAPS (${apiData.groupedData.largeCaps.length} activos, >$10B)

**Características del Grupo:**
[OBLIGATORIO: 3-4 párrafos describiendo estabilidad, liquidez, correlación con mercados tradicionales]

**Análisis Individual Top Performers:**
[OBLIGATORIO: Tabla con análisis de top 5 performers del grupo large caps usando datos reales]

**Must-Take Messages (Large Caps):**
1.  [Oportunidad específica con precio de entrada basado en datos reales]
2.  [Oportunidad específica con precio de entrada basado en datos reales]
3.  [Oportunidad específica con precio de entrada basado en datos reales]
4.  [Oportunidad específica con precio de entrada basado en datos reales]
5.  [Oportunidad específica con precio de entrada basado en datos reales]

**Estrategias Específicas Large Caps:**

| Activo | Entrada | Target | Stop Loss | R:R | Timeframe |
|--------|---------|--------|-----------|-----|-----------|
| [Top 3 Large Caps con estrategias específicas basadas en precios reales] |

**Scoring System Large Caps:**

| Activo | Score Inversión (1-10) | Score Riesgo (1-10) | Score Liquidez (1-5) | Recomendación |
|--------|----------------------|-------------------|-------------------|---------------|
| [Top 5 large caps con scores específicos] |

**Análisis Sectorial Large Caps:**
- **DeFi:** [Análisis específico basado en activos del grupo]
- **Layer 1:** [Análisis específico]
- **Payments:** [Análisis específico]

###  MID CAPS (${apiData.groupedData.midCaps.length} activos, $1B-$10B)

[OBLIGATORIO: REPETIR ESTRUCTURA COMPLETA igual que Large Caps con datos reales]

**Características del Grupo:**
[3-4 párrafos]

**Must-Take Messages (Mid Caps):**
1-4. [Oportunidades específicas]

**Análisis Sectorial Mid Caps:**
- **Gaming:** [Análisis específico]
- **AI/ML:** [Análisis específico]
- **Infrastructure:** [Análisis específico]

###  SMALL CAPS (${apiData.groupedData.smallCaps.length} activos, $100M-$1B)

[OBLIGATORIO: REPETIR ESTRUCTURA COMPLETA]

**Must-Take Messages (Small Caps):**
1-4. [Oportunidades de alto potencial]

**Análisis Sectorial Small Caps:**
- **Memes:** [Análisis específico]
- **Emerging Tech:** [Análisis específico]
- **Niche DeFi:** [Análisis específico]

### ⚡ MICRO CAPS (${apiData.groupedData.microCaps.length} activos, <$100M)

[Análisis basado en datos reales - si no hay datos, explicar por qué]

##  ANÁLISIS DE PERFORMANCE

### Top Performers 24h (Datos Reales de API)
[OBLIGATORIO: Tabla completa usando winnersTable - análisis de cada uno]

### Worst Performers 24h (Datos Reales de API)
[OBLIGATORIO: Tabla completa usando losersTable - análisis de cada uno]

### Mayores Volúmenes 24h (Datos Reales de API)
[OBLIGATORIO: Tabla completa usando volumeTable - análisis de liquidez]

##  ANÁLISIS DE VOLUMEN Y LIQUIDEZ

### Activos Mayor Volumen (15+ activos)
[OBLIGATORIO: Tabla con análisis de liquidez usando datos reales]

### Patrones de Volumen Inusuales
[OBLIGATORIO: Identificar 5+ activos con volumen anómalo]

### Correlación Volumen-Precio
[OBLIGATORIO: Análisis específico de correlaciones]

### Oportunidades de Arbitraje
[OBLIGATORIO: Identificar 3+ oportunidades específicas]

##  OBSERVACIONES Y ALERTAS

### Patrones Técnicos Identificados
[OBLIGATORIO: Mínimo 5 patrones específicos]

### Anomalías en Datos
[OBLIGATORIO: Identificar inconsistencias]

### Factores Fundamentales
[OBLIGATORIO: Análisis de factores que impactan el mercado]

## ⚙️ CONSIDERACIONES TÉCNICAS ESPECÍFICAS

[OBLIGATORIO: Sección completa con análisis chartista, indicadores técnicos, niveles críticos, patrón dominante, fase del ciclo, correlaciones y divergencias]

##  MATRICES DE RIESGO

### Matriz Riesgo-Retorno
[OBLIGATORIO: Clasificación por cuadrantes]

### Matriz Performance Cualitativa
[OBLIGATORIO: Tabla con 15+ activos principales]

### Análisis de Correlaciones
[OBLIGATORIO: Correlaciones entre activos y mercados tradicionales]

##  TRADING IDEAS

### Corto Plazo (1-7 días)
[OBLIGATORIO: Tabla con 5+ ideas específicas con precios exactos]

### Medio Plazo (1-4 semanas)
[OBLIGATORIO: Tabla con 5+ ideas específicas]

### Largo Plazo (1-6 meses)
[OBLIGATORIO: Tabla con 3+ ideas específicas]

##  ASIGNACIÓN DE CARTERA

### Perfil Conservador
[OBLIGATORIO: Objetivo, horizonte, asignación, activos específicos con niveles de entrada]

### Perfil Moderado
[OBLIGATORIO: Estructura completa]

### Perfil Agresivo
[OBLIGATORIO: Estructura completa]

##  CONCLUSIONES Y PERSPECTIVAS

### Fase Actual del Mercado
[OBLIGATORIO: Evaluación detallada]

### Principales Takeaways (5 puntos específicos)
[OBLIGATORIO: 5 puntos específicos con datos]

### Escenarios Prospectivos
[OBLIGATORIO: Escenario Alcista, Base y Bajista con niveles específicos]

### Factores de Riesgo a Monitorear
[OBLIGATORIO: Mínimo 5 factores específicos]

### Recomendaciones Finales
[OBLIGATORIO: 5 recomendaciones actionables]

---

**IMPORTANTE**: El análisis DEBE tener mínimo 500 líneas y DEBE incluir TODAS las secciones listadas arriba. NO omitas ninguna sección. Usa los datos reales de la API en todas las tablas y análisis.
`;
}

// Funciones de compatibilidad
export const generateAnalysisWithGemini = analyzeCryptoData;

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

      if (error.message?.includes('API_KEY_INVALID') ||
          error.message?.includes('QUOTA_EXCEEDED')) {
        throw error;
      }

      if (attempt < maxRetries) {
        const waitTime = attempt * 2000;
        console.log(`⏳ Esperando ${waitTime/1000}s antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
};

export const generateAnalysisFromPrompt = async (prompt: string): Promise<string> => {
  return `# Análisis Basado en Prompt\n\n**Prompt recibido:** ${prompt}\n\n*Para un análisis completo, utiliza la función de análisis con datos de la API de CoinGecko.*`;
};
