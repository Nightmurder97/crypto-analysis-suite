import * as XLSX from 'xlsx';
import { CryptoData } from '../types';

export interface FieldConfig<T> {
  key: keyof T | string;
  label: string;
  formatter?: (value: T[keyof T] | any, item: T) => string | number;
}

function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce<any>((acc, part: string) => acc && acc[part], obj);
}

// Configuración de la carpeta de descarga fija
// const DOWNLOAD_FOLDER = 'CryptoAnalysisExports'; // Para futuras versiones

// Función para crear la estructura de carpetas si no existe (no utilizada actualmente)
// function createDownloadFolder(): string {
//   const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//   return `${DOWNLOAD_FOLDER}/${timestamp}`;
// }

// Función para generar nombre de archivo con timestamp
function generateFileName(baseName: string, extension: string = 'xlsx'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${baseName}_${timestamp}.${extension}`;
}

export function exportDataToXlsx<T>(
  data: T[], 
  baseName: string, 
  fieldConfigs: FieldConfig<T>[],
  sheetName: string = 'Datos'
): void {
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar.");
    return;
  }

  try {
    // Crear workbook
    const workbook = XLSX.utils.book_new();
    
    // Preparar datos para la hoja
    const worksheetData = data.map(item => {
      const row: any = {};
      fieldConfigs.forEach(config => {
        let value: any;
        
        // Obtener valor (directo o anidado)
        if (typeof config.key === 'string' && (config.key as string).includes('.')) {
          value = getNestedValue(item, config.key as string);
        } else {
          value = item[config.key as keyof T];
        }
        
        // Aplicar formateador si existe
        const formattedValue = config.formatter ? config.formatter(value, item) : value;
        
        // Limpiar valor para Excel
        row[config.label] = (formattedValue === null || formattedValue === undefined) ? '' : formattedValue;
      });
      return row;
    });

    // Crear hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Configurar ancho de columnas automático
    const columnWidths = fieldConfigs.map(config => ({ wch: Math.max(config.label.length, 15) }));
    worksheet['!cols'] = columnWidths;
    
    // Añadir hoja al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generar nombre de archivo
    const fileName = generateFileName(baseName);
    
    // Generar archivo y descargar
    XLSX.writeFile(workbook, fileName);
    
    console.log(`✅ Archivo exportado exitosamente: ${fileName}`);
    
  } catch (error) {
    console.error('❌ Error al exportar archivo XLSX:', error);
  }
}

// Función específica para exportar datos de criptomonedas
export function exportCryptoDataToXlsx(
  data: CryptoData[], 
  baseName: string = 'crypto_data',
  includeAllFields: boolean = false
): void {
  const basicFields: FieldConfig<CryptoData>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'symbol', label: 'Símbolo' },
    { key: 'current_price', label: 'Precio Actual ($)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'market_cap', label: 'Capitalización de Mercado ($)', formatter: (value) => Number(value) },
    { key: 'market_cap_rank', label: 'Ranking' },
    { key: 'total_volume', label: 'Volumen 24h ($)', formatter: (value) => Number(value) },
    { key: 'price_change_percentage_1h_in_currency', label: 'Cambio 1h (%)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'price_change_percentage_24h', label: 'Cambio 24h (%)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'price_change_percentage_7d_in_currency', label: 'Cambio 7d (%)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'price_change_percentage_30d_in_currency', label: 'Cambio 30d (%)', formatter: (value) => Number(value?.toFixed(2)) },
  ];

  const extendedFields: FieldConfig<CryptoData>[] = [
    ...basicFields,
    { key: 'high_24h', label: 'Máximo 24h ($)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'low_24h', label: 'Mínimo 24h ($)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'price_change_24h', label: 'Cambio Precio 24h ($)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'market_cap_change_24h', label: 'Cambio Cap. Mercado 24h ($)', formatter: (value) => Number(value) },
    { key: 'market_cap_change_percentage_24h', label: 'Cambio Cap. Mercado 24h (%)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'circulating_supply', label: 'Suministro Circulante', formatter: (value) => Number(value) },
    { key: 'total_supply', label: 'Suministro Total', formatter: (value) => Number(value) },
    { key: 'max_supply', label: 'Suministro Máximo', formatter: (value) => Number(value) },
    { key: 'ath', label: 'Máximo Histórico ($)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'ath_change_percentage', label: 'Cambio desde ATH (%)', formatter: (value) => Number(value?.toFixed(2)) },
    { key: 'atl', label: 'Mínimo Histórico ($)', formatter: (value) => Number(value?.toFixed(8)) },
    { key: 'atl_change_percentage', label: 'Cambio desde ATL (%)', formatter: (value) => Number(value?.toFixed(2)) },
  ];

  const fieldsToUse = includeAllFields ? extendedFields : basicFields;
  const sheetName = includeAllFields ? 'Datos Completos' : 'Resumen';
  
  exportDataToXlsx(data, baseName, fieldsToUse, sheetName);
}

// Función para exportar análisis de IA
export function exportAnalysisToXlsx(analysisText: string, baseName: string = 'crypto_analysis'): void {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Dividir el análisis en líneas para mejor formato
    const lines = analysisText.split('\n').map(line => ({ 'Análisis IA': line }));
    
    const worksheet = XLSX.utils.json_to_sheet(lines);
    worksheet['!cols'] = [{ wch: 100 }]; // Ancho amplio para el texto
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Análisis IA');
    
    const fileName = generateFileName(baseName);
    XLSX.writeFile(workbook, fileName);
    
    console.log(`✅ Análisis exportado exitosamente: ${fileName}`);
    
  } catch (error) {
    console.error('❌ Error al exportar análisis:', error);
  }
}

// Función para exportar múltiples hojas en un solo archivo
export function exportMultiSheetXlsx(
  sheets: Array<{
    data: any[];
    sheetName: string;
    fieldConfigs: FieldConfig<any>[];
  }>,
  baseName: string = 'crypto_multi_data'
): void {
  try {
    const workbook = XLSX.utils.book_new();
    
    sheets.forEach(({ data, sheetName, fieldConfigs }) => {
      if (data && data.length > 0) {
        const worksheetData = data.map(item => {
          const row: any = {};
          fieldConfigs.forEach(config => {
            let value: any;
            
            if (typeof config.key === 'string' && (config.key as string).includes('.')) {
              value = getNestedValue(item, config.key as string);
            } else {
              value = item[config.key as keyof typeof item];
            }
            
            const formattedValue = config.formatter ? config.formatter(value, item) : value;
            row[config.label] = (formattedValue === null || formattedValue === undefined) ? '' : formattedValue;
          });
          return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const columnWidths = fieldConfigs.map(config => ({ wch: Math.max(config.label.length, 15) }));
        worksheet['!cols'] = columnWidths;
        
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    });
    
    const fileName = generateFileName(baseName);
    XLSX.writeFile(workbook, fileName);
    
    console.log(`✅ Archivo multi-hoja exportado exitosamente: ${fileName}`);
    
  } catch (error) {
    console.error('❌ Error al exportar archivo multi-hoja:', error);
  }
} 