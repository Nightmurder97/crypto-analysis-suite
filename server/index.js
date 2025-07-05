require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Proxy para CoinGecko API con rate limiting
app.get('/api/coingecko/*', async (req, res) => {
  try {
    const path = req.path.replace('/api/coingecko/', '');
    const queryString = new URLSearchParams(req.query).toString();
    const url = `https://api.coingecko.com/api/v3/${path}${queryString ? '?' + queryString : ''}`;
    
    console.log(`Proxying request to CoinGecko: ${url}`);
    
    const headers = {
      'User-Agent': 'Crypto-Analysis-Suite/1.0'
    };
    
    // Añadir API key si está disponible
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error en el proxy de CoinGecko:', error);
    res.status(500).json({ error: 'Error al obtener datos de CoinGecko', details: error.message });
  }
});

app.post('/api/generate-analysis', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es obligatorio.' });
    }
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: 32768,
        temperature: 0.7,
      }
    });
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