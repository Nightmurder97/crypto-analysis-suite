// src/App.tsx - Actualizar constantes para mostrar todos los elementos

const STABLECOIN_KEYWORDS = ['stablecoin', 'usd', 'dai', 'tether', 'busd', 'usdc', 'fdusd', 'usdt', 'usdp', 'pyusd', 'tusd', 'eurc', 'eurs'];

// 🔥 CAMBIO PRINCIPAL: Mostrar todos los elementos en una página
const HEATMAP_ITEMS_PER_PAGE = 1000;  // ✅ Era 50, ahora todos
const CLASSIC_HEATMAP_ITEMS_PER_PAGE = 1000;  // ✅ Era 100, ahora todos

// También actualizar la lógica de paginación para manejar esto
const paginatedHeatmapData = useMemo(() => {
    // Si queremos mostrar todos, no paginar
    if (HEATMAP_ITEMS_PER_PAGE >= filteredCryptoData.length) {
        return filteredCryptoData;
    }
    
    const startIndex = (currentHeatmapPage - 1) * HEATMAP_ITEMS_PER_PAGE;
    const endIndex = startIndex + HEATMAP_ITEMS_PER_PAGE;
    return filteredCryptoData.slice(startIndex, endIndex);
}, [filteredCryptoData, currentHeatmapPage]);

const paginatedClassicHeatmapData = useMemo(() => {
    // Si queremos mostrar todos, no paginar
    if (CLASSIC_HEATMAP_ITEMS_PER_PAGE >= filteredCryptoData.length) {
        return filteredCryptoData;
    }
    
    const startIndex = (currentClassicHeatmapPage - 1) * CLASSIC_HEATMAP_ITEMS_PER_PAGE;
    const endIndex = startIndex + CLASSIC_HEATMAP_ITEMS_PER_PAGE;
    return filteredCryptoData.slice(startIndex, endIndex);
}, [filteredCryptoData, currentClassicHeatmapPage]);

// Actualizar el cálculo de páginas totales
const totalHeatmapPages = useMemo(() => {
    if (HEATMAP_ITEMS_PER_PAGE >= filteredCryptoData.length) return 1;
    return Math.max(1, Math.ceil(filteredCryptoData.length / HEATMAP_ITEMS_PER_PAGE));
}, [filteredCryptoData]);

const totalClassicHeatmapPages = useMemo(() => {
    if (CLASSIC_HEATMAP_ITEMS_PER_PAGE >= filteredCryptoData.length) return 1;
    return Math.max(1, Math.ceil(filteredCryptoData.length / CLASSIC_HEATMAP_ITEMS_PER_PAGE));
}, [filteredCryptoData]);