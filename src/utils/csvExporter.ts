export interface FieldConfig<T> {
  key: keyof T | string; // Allow string for deeply nested paths if needed, though direct keys are simpler
  label: string;
  formatter?: (value: T[keyof T] | any, item: T) => string; // Allow 'any' for complex/nested values
}

function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce<any>((acc, part: string) => acc && acc[part], obj);
}

export function exportDataToCsv<T>(data: T[], filename: string, fieldConfigs: FieldConfig<T>[]): void {
  if (!data || data.length === 0) {
    console.warn("No data to export.");
    return;
  }

  const header = fieldConfigs.map(config => `"${config.label.replace(/"/g, '""')}"`).join(',');

  const rows = data.map(item => {
    return fieldConfigs.map(config => {
      let value: any;
      // Check if the key is a direct key or a nested path
      if (typeof config.key === 'string' && (config.key as string).includes('.')) {
        value = getNestedValue(item, config.key as string);
      } else {
        value = item[config.key as keyof T];
      }
      
      const formattedValue = config.formatter ? config.formatter(value, item) : value;
      const stringValue = (formattedValue === null || formattedValue === undefined) ? '' : String(formattedValue);
      return `"${stringValue.replace(/"/g, '""')}"`; // Escape double quotes
    }).join(',');
  });

  const csvContent = [header, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Función para exportar análisis de texto a Markdown
export function exportAnalysisToMd(analysisText: string, filename: string): void {
  if (!analysisText || analysisText.trim() === '') {
    console.warn("No analysis text to export.");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fullFilename = `${filename}_${timestamp}.md`;
  
  const blob = new Blob([analysisText], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', fullFilename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Función para exportar análisis de texto a CSV (convierte el texto en un formato CSV simple)
export function exportAnalysisToCsv(analysisText: string, filename: string): void {
  if (!analysisText || analysisText.trim() === '') {
    console.warn("No analysis text to export.");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fullFilename = `${filename}_${timestamp}.csv`;
  
  // Convertir el texto del análisis a formato CSV simple
  const csvHeader = '"Sección","Contenido"';
  const lines = analysisText.split('\n');
  const csvRows = lines.map(line => {
    const cleanLine = line.replace(/"/g, '""'); // Escapar comillas
    return `"Línea","${cleanLine}"`;
  });
  
  const csvContent = [csvHeader, ...csvRows].join('\r\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', fullFilename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
