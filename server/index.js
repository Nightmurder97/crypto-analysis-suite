require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("La variable de entorno GEMINI_API_KEY o VITE_GEMINI_API_KEY no está definida.");
}
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/api/generate-analysis', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es obligatorio.' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); // Consistent model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ analysis: text });
  } catch (error) {
    console.error('Error generando el análisis con Gemini:', error);
    res.status(500).json({ error: 'Error al generar el análisis.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor proxy escuchando en http://localhost:${PORT}`);
});