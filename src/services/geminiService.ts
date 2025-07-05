// src/services/geminiService.ts
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
