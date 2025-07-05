### Análisis y Mejoras para Crypto Analysis Suite

**Este documento ofrece un análisis completo del proyecto, identifica áreas clave de mejora y propone nuevas funcionalidades para enriquecer la aplicación.**

### 1. Resumen General

**La aplicación es una suite de análisis de criptomonedas construida con React, TypeScript y Vite. Utiliza la API de CoinGecko para obtener datos del mercado y la API de Gemini para generar análisis basados en IA. La visualización de datos se realiza con D3.js.**

**Puntos Fuertes:**

* **Stack Tecnológico Moderno:** El uso de React, Vite y TypeScript proporciona una base sólida y escalable.
* **Integración de IA:** La generación de análisis con Gemini es una característica distintiva y de gran valor.
* **Visualización de Datos:** Los heatmaps y las tablas con sparklines ofrecen una visión rápida y efectiva del mercado.

**Áreas Críticas a Mejorar:**

1. **Seguridad:** Exposición de la clave de API en el lado del cliente.
2. **Estructura del Proyecto:** Archivos duplicados y desorganización en el directorio raíz.
3. **Gestión de Estado:** El manejo del estado puede volverse complejo y poco eficiente a medida que la aplicación crece.
4. **Experiencia de Usuario (UX):** Falta de indicadores de carga y manejo de errores.

### 2. Problemas Críticos y Soluciones

#### 🚨 2.1. (URGENTE) Vulnerabilidad de Seguridad: Clave de API Expuesta

**Problema:** La clave de la API de Gemini se define en `<span class="selected">global.d.ts</span>` y se utiliza directamente en el frontend (`<span class="selected">src/services/geminiService.ts</span>`). Esto permite que cualquier persona que visite la web pueda encontrar y usar tu clave, lo que podría generar costes inesperados y abuso del servicio.

**Solución: Crear un Servidor Proxy (Backend)**
La única forma segura de manejar claves de API es a través de un backend que actúe como intermediario. El frontend le hace una petición a tu backend, y tu backend (donde la clave está segura) le hace la petición a la API de Gemini.

**Ejemplo de un proxy simple usando Node.js y Express:**

1. **Crea un directorio `<span class="selected">server</span>` en la raíz del proyecto.**
2. **Instala las dependencias:**`<span class="selected">npm install express cors dotenv @google/generative-ai</span>`
3. **Crea un archivo `<span class="selected">.env</span>` en el directorio `<span class="selected">server</span>` y añade tu clave:**
   ```
   GEMINI_API_KEY=TU_CLAVE_SECRETA_AQUI

   ```
4. **Crea `<span class="selected">server/index.js</span>`:**
   ```
   // server/index.js
   require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const { GoogleGenerativeAI } = require('@google/generative-ai');

   const app = express();
   app.use(cors()); // Permite peticiones desde tu frontend
   app.use(express.json());

   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

   app.post('/api/generate-analysis', async (req, res) => {
       try {
           const { prompt } = req.body;
           if (!prompt) {
               return res.status(400).json({ error: 'Prompt is required' });
           }

           const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
           const result = await model.generateContent(prompt);
           const response = await result.response;
           const text = response.text();

           res.json({ analysis: text });
       } catch (error) {
           console.error('Error generating analysis:', error);
           res.status(500).json({ error: 'Failed to generate analysis' });
       }
   });

   const PORT = process.env.PORT || 3001;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

   ```
5. **Modifica `<span class="selected">geminiService.ts</span>` para que llame a tu nuevo backend:**
   ```
   // src/services/geminiService.ts
   export const generateAnalysisWithGemini = async (prompt: string): Promise<string> => {
     try {
       // La URL de tu nuevo servidor proxy
       const response = await fetch('http://localhost:3001/api/generate-analysis', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ prompt }),
       });

       if (!response.ok) {
         throw new Error('Failed to get analysis from backend');
       }

       const data = await response.json();
       return data.analysis;
     } catch (error) {
       console.error("Error generating analysis:", error);
       return "Error: No se pudo generar el análisis.";
     }
   };

   ```

#### 🧹 2.2. Refactorización de la Estructura del Proyecto

**Problema:** El directorio raíz contiene una mezcla de archivos de configuración, componentes de React (`<span class="selected">App.tsx</span>`, `<span class="selected">CryptoTable.tsx</span>`), archivos HTML (`<span class="selected">crypto_heatmap.html</span>`) y código fuente duplicado que también existe dentro de `<span class="selected">src</span>`. Esto dificulta el mantenimiento.

**Solución: Centralizar todo en `<span class="selected">src</span>` y limpiar la raíz.**

1. **Eliminar Archivos Duplicados/Obsoletos:** Borra todos los archivos `<span class="selected">.tsx</span>`, `<span class="selected">.css</span>` y `<span class="selected">.ts</span>` del directorio raíz que ya existen dentro de `<span class="selected">src</span>`. Por ejemplo: `<span class="selected">App.tsx</span>`, `<span class="selected">AnalysisSection.tsx</span>`, `<span class="selected">apiClient.ts</span>`, etc.
2. **Eliminar Archivos HTML Antiguos:** Los archivos como `<span class="selected">crypto_analysis_dashboard.html</span>`, `<span class="selected">crypto_heatmap.html</span>`, etc., parecen ser de una versión anterior no basada en React. Si ya no se usan, elimínalos. Si son importantes, deben ser convertidos en componentes de React.
3. **Resultado Esperado:** El directorio raíz solo debería contener:
   * `<span class="selected">src/</span>` (todo el código de la aplicación)
   * `<span class="selected">public/</span>` (recursos estáticos como imágenes o favicons)
   * `<span class="selected">server/</span>` (el nuevo backend proxy)
   * **Archivos de configuración: **`<span class="selected">index.html</span>`, `<span class="selected">vite.config.ts</span>`, `<span class="selected">tsconfig.json</span>`, `<span class="selected">package.json</span>`, `<span class="selected">.gitignore</span>`, etc.

### 3. Mejoras de Código y Arquitectura

#### 3.1. Gestión de Estado Avanzada

**Problema:**`<span class="selected">App.tsx</span>` maneja múltiples estados con `<span class="selected">useState</span>`. A medida que la aplicación crezca, pasar props a través de muchos niveles (prop drilling) será ineficiente y propenso a errores.

**Solución: Usar React Query (TanStack Query) y Zustand.**

* **Para el estado del servidor (datos de API):** Usa  **React Query** **. Simplifica enormemente la obtención, cacheo, sincronización y actualización de datos de APIs. Maneja automáticamente los estados de carga, error y éxito.**
  **Ejemplo con React Query para `<span class="selected">apiClient.ts</span>`:**

  ```
  // src/utils/apiClient.ts
  import { useQuery } from '@tanstack/react-query';

  // ... (tu función fetchCryptoData existente)

  export const useCryptoData = (page: number) => {
    return useQuery({
      queryKey: ['cryptoData', page], // Clave de caché
      queryFn: () => fetchCryptoData(page),
      staleTime: 60 * 1000, // No volver a pedir datos durante 1 minuto
    });
  };

  ```

  **En tu componente **`<span class="selected">App.tsx</span>`, en lugar de `<span class="selected">useEffect</span>` y `<span class="selected">useState</span>`:

  ```
  // src/App.tsx
  const { data, isLoading, isError } = useCryptoData(currentPage);

  ```
* **Para el estado global del cliente:** Usa  **Zustand** **. Es una librería de gestión de estado muy ligera y sencilla, ideal para estados que no provienen de una API, como la vista activa, el tema (claro/oscuro), etc.**

#### 3.2. Mejorar la Experiencia de Usuario (UX)

**Problema:** La aplicación no muestra una retroalimentación clara mientras los datos se están cargando o si ocurre un error.

**Soluciones:**

* **Indicadores de Carga:** Muestra "skeletons" (esqueletos de UI) o spinners mientras los datos de la tabla o los análisis de IA se están cargando.
* **Manejo de Errores:** Si una llamada a la API falla, muestra un mensaje amigable al usuario en lugar de dejar la sección en blanco o crashear la aplicación.

**Ejemplo en `<span class="selected">CryptoTable.tsx</span>`:**

```
// CryptoTable.tsx
// ...
if (isLoading) {
  return <div>Cargando datos del mercado...</div>; // O un componente de Skeleton
}

if (isError) {
  return <div>Error: No se pudieron cargar los datos. Inténtalo de nuevo más tarde.</div>;
}

return (
  // ... tu tabla con los datos
);

```

### 4. Nuevas Características Sugeridas

* **Persistencia de Datos:** Permite a los usuarios guardar la configuración de su portafolio en el simulador. Puedes usar `<span class="selected">localStorage</span>` para una solución rápida o un backend con base de datos para una solución completa con cuentas de usuario.
* **Página de Detalles de Criptomoneda:** Al hacer clic en una fila de la tabla, llevar al usuario a una vista detallada con gráficos históricos (usando D3.js o una librería como Chart.js), estadísticas avanzadas y el análisis de IA específico para esa moneda.
* **Búsqueda y Filtros:** Añade un campo de búsqueda para filtrar las criptomonedas en la tabla por nombre o símbolo.
* **Sistema de Alertas:** Permite a los usuarios establecer alertas de precios para criptomonedas específicas.
* **Modo Oscuro/Claro:** Una opción de personalización muy demandada que mejora la accesibilidad y la experiencia visual.

### 5. Plan de Acción Recomendado

**Te sugiero seguir estos pasos en orden de prioridad:**

1. **Prioridad Máxima:** Implementar el **servidor proxy** para proteger tu clave de API de Gemini.
2. **Limpieza:****Refactorizar la estructura de archivos** para tener un proyecto limpio y organizado.
3. **Mejorar la Base:** Integrar **React Query** para la gestión de datos de API. Esto hará que el resto del desarrollo sea mucho más sencillo.
4. **Mejorar UX:** Añadir **indicadores de carga y manejo de errores** en toda la aplicación.
5. **Expandir:** Empezar a implementar las  **nuevas características** **, como la página de detalles de criptomoneda.**

**Este proyecto tiene un gran potencial. Con estas mejoras, no solo será más robusto y seguro, sino también mucho más útil y agradable para los usuarios finales.**

**¡Excelente trabajo hasta ahora y mucho éxito con las siguientes fases del desarrollo!**

## Backend: Servidor Proxy (server/index.js)

```js
// server/index.js// Descripción: Este es un servidor proxy simple usando Express.js.// Su propósito principal es ocultar la clave de la API de Gemini del cliente (navegador).// El frontend hará peticiones a este servidor, y este servidor, que se ejecuta en un entorno seguro,// añadirá la clave de API y reenviará la petición a la API de Gemini.// Importar las dependencias necesariasconst express = require('express');const cors = require('cors');const { GoogleGenerativeAI } = require('@google/generative-ai');// 'dotenv' nos permite cargar variables de entorno desde un archivo .envrequire('dotenv').config();// Inicializar la aplicación Expressconst app = express();// --- Middlewares ---// Habilitar CORS para permitir que tu frontend (ej. ejecutándose en http://localhost:5173)// pueda hacer peticiones a este servidor (ej. ejecutándose en http://localhost:3001).app.use(cors());// Habilitar el parseo de JSON en el cuerpo de las peticiones POST.app.use(express.json());// --- Configuración de la API de Gemini ---// Asegurarse de que la clave de API está disponible. Si no, el servidor no podrá funcionar.if (!process.env.GEMINI_API_KEY) {thrownewError("La variable de entorno GEMINI_API_KEY no está definida.");}// Crear una instancia del cliente de la IA Generativa de Google.const genAI = newGoogleGenerativeAI(process.env.GEMINI_API_KEY);// --- Rutas de la API ---// Definir un endpoint POST para generar el análisis.// El frontend enviará el 'prompt' aquí.app.post('/api/generate-analysis', async (req, res) => {  console.log('Petición recibida en /api/generate-analysis');try {// Extraer el 'prompt' del cuerpo de la petición.const { prompt } = req.body;// Validación: asegurarse de que el prompt no está vacío.if (!prompt) {      console.error('Intento de petición sin prompt.');return res.status(400).json({ error: 'El prompt es obligatorio.' });    }// Seleccionar el modelo de IA a utilizar.const model = genAI.getGenerativeModel({ model: 'gemini-pro' });// Generar el contenido usando el prompt.const result = await model.generateContent(prompt);const response = await result.response;const text = response.text();// Enviar el texto generado de vuelta al frontend.    res.json({ analysis: text });  } catch (error) {// Manejo de errores. Si algo falla con la API de Gemini, se captura aquí.    console.error('Error generando el análisis con Gemini:', error);    res.status(500).json({ error: 'Error al generar el análisis.' });  }});// --- Iniciar el Servidor ---// Definir el puerto. Usará el puerto definido en las variables de entorno, o 3001 por defecto.constPORT = process.env.PORT || 3001;// Poner el servidor a escuchar en el puerto especificado.app.listen(PORT, () => {  console.log(Servidor proxy escuchando en http://localhost:${PORT});});
```



## Backend: Variables de Entorno (server/.env)

```env
# server/.env
# Pega tu clave de API de Gemini aquí.
# Este archivo NUNCA debe ser subido a un repositorio público (añádelo a .gitignore).
GEMINI_API_KEY="TU_CLAVE_SECRETA_DE_GEMINI_AQUI"
```

## Backend: Dependencias (server/package.json)

```json
{
  "name": "crypto-suite-server",
  "version": "1.0.0",
  "description": "Servidor proxy para la Crypto Analysis Suite",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "@google/generative-ai": "^0.1.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}

```

## Frontend: Dependencias (package.json - Raíz)

```
json
{
  "name": "crypto-analysis-suite",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.17.9",
    "d3": "^7.8.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/d3": "^7.4.3",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}

```

## Frontend: Punto de Entrada (src/index.tsx)

```typescript
// src/index.tsx
// Punto de entrada principal de la aplicación React.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Estilos globales con TailwindCSS

// Importaciones para React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crear una instancia del cliente de React Query.
// Este cliente gestionará el cacheo y estado de las peticiones a la API.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolver toda la aplicación con el QueryClientProvider */}
    {/* para que cualquier componente pueda usar los hooks de React Query. */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

```

## Frontend: Servicio Gemini (src/services/geminiService.ts)


```typescript
// src/services/geminiService.ts
// Este archivo ahora se comunica con NUESTRO backend, no directamente con la API de Gemini.

/**
 * Genera un análisis de mercado de criptomonedas utilizando el backend como proxy.
 * @param prompt El prompt que se enviará al modelo de IA.
 * @returns Una promesa que se resuelve con el texto del análisis generado.
 */
export const generateAnalysisWithGemini = async (prompt: string): Promise<string> => {
  try {
    // La URL apunta a nuestro servidor proxy local.
    const response = await fetch('http://localhost:3001/api/generate-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    // Si la respuesta del servidor no es exitosa (ej. status 500), lanzamos un error.
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data.analysis;

  } catch (error) {
    console.error("Error al generar el análisis:", error);
    // Devolvemos un mensaje de error claro para ser mostrado en la UI.
    return "Error: No se pudo generar el análisis. Revisa la consola del navegador y del servidor para más detalles.";
  }
};

```


## Frontend: Cliente API con React Query (src/utils/apiClient.ts)


```typescript
// src/utils/apiClient.ts
// Este archivo utiliza React Query para gestionar las peticiones a la API de CoinGecko.

import { useQuery, useMutation } from '@tanstack/react-query';
import { CryptoData } from '../types';
import { generateAnalysisWithGemini } from '../services/geminiService';

// --- Función para obtener datos de CoinGecko ---
const fetchCryptoData = async (page: number = 1, perPage: number = 50): Promise<CryptoData[]> => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('La petición a CoinGecko falló');
    }
    return response.json();
};

// --- Custom Hook para obtener los datos de criptomonedas ---
// Este hook encapsula la lógica de fetching, cacheo, y estados de carga/error.
export const useCryptoData = (page: number) => {
  return useQuery({
    queryKey: ['cryptoData', page], // La clave de caché depende de la página
    queryFn: () => fetchCryptoData(page),
    staleTime: 60 * 1000, // Los datos se consideran "frescos" por 60 segundos
    refetchInterval: 60 * 1000, // Vuelve a pedir los datos cada 60 segundos
  });
};


// --- Custom Hook (Mutation) para generar análisis con Gemini ---
// Usamos 'useMutation' para acciones que modifican datos o realizan acciones (como generar un reporte).
export const useGenerateAnalysis = () => {
    return useMutation({
        mutationFn: (prompt: string) => generateAnalysisWithGemini(prompt),
    });
};

```


## Frontend: Componente Principal (src/App.tsx)

```typescript
// src/App.tsx
// Componente principal refactorizado. Ahora es más limpio y delega la lógica a los componentes hijos.

import { useState } from 'react';
import CryptoTable from './components/CryptoTable';
import AnalysisSection from './components/AnalysisSection';
import PaginationControls from './components/PaginationControls';

function App() {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  // Estado para los datos de criptomonedas seleccionadas para el análisis
  const [selectedCryptoForAnalysis, setSelectedCryptoForAnalysis] = useState<any[]>([]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-center text-cyan-400">Crypto Analysis Suite</h1>
      </header>

      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal con la tabla de datos */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Mercado General</h2>
            <CryptoTable
              currentPage={currentPage}
              onSelectCrypto={setSelectedCryptoForAnalysis}
            />
            <PaginationControls
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Columna lateral para el análisis de IA */}
        <div className="lg:col-span-1">
          <AnalysisSection selectedCryptos={selectedCryptoForAnalysis} />
        </div>
      </main>
    </div>
  );
}

export default App;

```



## Frontend: Tabla de Criptos (src/components/CryptoTable.tsx)

```typescript
// src/components/CryptoTable.tsx
// Componente que muestra la tabla de criptomonedas.
// Ahora utiliza el hook 'useCryptoData' y maneja estados de carga y error.

import { useCryptoData } from '../utils/apiClient';
import { CryptoData } from '../types';

// Componente para mostrar una celda de la tabla con formato
const TableCell = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <td className={`p-3 text-sm ${className}`}>{children}</td>
);

// Componente para mostrar un skeleton loader mientras cargan los datos
const SkeletonRow = () => (
    <tr className="border-b border-gray-700 animate-pulse">
        <TableCell><div className="h-4 bg-gray-600 rounded w-8"></div></TableCell>
        <TableCell>
            <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-600 mr-3"></div>
                <div className="h-4 bg-gray-600 rounded w-24"></div>
            </div>
        </TableCell>
        <TableCell><div className="h-4 bg-gray-600 rounded w-16"></div></TableCell>
        <TableCell><div className="h-4 bg-gray-600 rounded w-12"></div></TableCell>
        <TableCell><div className="h-4 bg-gray-600 rounded w-12"></div></TableCell>
        <TableCell><div className="h-4 bg-gray-600 rounded w-20"></div></TableCell>
    </tr>
);


interface CryptoTableProps {
  currentPage: number;
  onSelectCrypto: (cryptos: CryptoData[]) => void;
}

const CryptoTable = ({ currentPage, onSelectCrypto }: CryptoTableProps) => {
  // Usar el hook para obtener los datos. React Query maneja el estado.
  const { data, isLoading, isError, error } = useCryptoData(currentPage);

  // --- Renderizado Condicional ---
  if (isLoading) {
    return (
        <table className="w-full">
            <thead>
                {/* ... encabezados ... */}
            </thead>
            <tbody>
                {/* Mostrar 10 filas de esqueleto para dar una idea del contenido que vendrá */}
                {Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
        </table>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 bg-red-900/20 rounded-lg">
        <h3 className="text-xl text-red-400">Error al cargar los datos</h3>
        <p className="text-gray-400 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Moneda</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3">24h %</th>
                    <th className="p-3">7d %</th>
                    <th className="p-3">Capitalización de Mercado</th>
                </tr>
            </thead>
            <tbody>
                {data?.map((coin) => (
                    <tr key={coin.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <TableCell>{coin.market_cap_rank}</TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-3 rounded-full"/>
                                <span>{coin.name} <span className="text-gray-400">{coin.symbol.toUpperCase()}</span></span>
                            </div>
                        </TableCell>
                        <TableCell>${coin.current_price.toLocaleString()}</TableCell>
                        <TableCell className={coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell className={coin.price_change_percentage_7d_in_currency > 0 ? 'text-green-400' : 'text-red-400'}>
                            {coin.price_change_percentage_7d_in_currency.toFixed(2)}%
                        </TableCell>
                        <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
                    </tr>
                ))}
            </tbody>
        </table>
        <button onClick={() => onSelectCrypto(data || [])} className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded w-full">
            Analizar esta Página con IA
        </button>
    </div>
  );
};

export default CryptoTable;

```



## Frontend: Sección de Análisis (src/components/AnalysisSection.tsx)


```typescript
// src/components/AnalysisSection.tsx
// Componente para la sección de análisis con IA.
// Utiliza el hook 'useGenerateAnalysis' (una mutación de React Query).

import { useGenerateAnalysis } from '../utils/apiClient';
import { CryptoData } from '../types';

interface AnalysisSectionProps {
  selectedCryptos: CryptoData[];
}

const AnalysisSection = ({ selectedCryptos }: AnalysisSectionProps) => {
  // Usar el hook de mutación.
  const { mutate, data: analysisResult, isPending, isError, error } = useGenerateAnalysis();

  const handleGenerateAnalysis = () => {
    if (selectedCryptos.length === 0) {
      alert("Por favor, primero haz clic en 'Analizar esta Página con IA' en la tabla.");
      return;
    }

    // Crear un prompt detallado para la IA.
    const cryptoList = selectedCryptos.map(c => `${c.name} (${c.symbol.toUpperCase()}) con un precio de $${c.current_price} y una capitalización de $${c.market_cap}`).join(', ');
    const prompt = `
      Eres un analista experto en criptomonedas.
      Basado en la siguiente lista de criptomonedas y sus datos de mercado, 
      genera un resumen ejecutivo para un inversor.
  
      Datos: ${cryptoList}

      El análisis debe incluir:
      1. Una visión general del sentimiento del mercado basado en los cambios de precio.
      2. Identifica 2-3 monedas que parezcan destacables (positiva o negativamente) y explica por qué.
      3. Ofrece una conclusión concisa sobre la tendencia general observada.

      Formatea la respuesta en Markdown.
    `;
  
    // Ejecutar la mutación.
    mutate(prompt);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg sticky top-8">
      <h2 className="text-2xl font-semibold mb-4">Análisis con IA (Gemini)</h2>
      <button
        onClick={handleGenerateAnalysis}
        disabled={isPending || selectedCryptos.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isPending ? 'Generando...' : 'Generar Reporte de Análisis'}
      </button>

      <div className="mt-6 min-h-[300px] bg-gray-900/50 p-4 rounded">
        {isPending && <p className="text-center text-gray-400 animate-pulse">La IA está pensando...</p>}
        {isError && (
            <div className="text-red-400">
                <p>Error al generar el análisis:</p>
                <p className="text-sm mt-2">{error.message}</p>
            </div>
        )}
        {analysisResult && (
            <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">{analysisResult}</pre>
            </div>
        )}
        {!analysisResult && !isPending && !isError && (
            <p className="text-center text-gray-500">El análisis aparecerá aquí.</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisSection;

```


# Plan de Acción y To-Do List: Crypto Analysis Suite

Usa esta lista para llevar un registro de las tareas completadas para mejorar la seguridad, estructura y funcionalidad de la aplicación.

### ✅ Fase 1: Seguridad y Estructura (Prioridad Máxima)

El objetivo de esta fase es solucionar la vulnerabilidad de seguridad crítica y organizar el proyecto para facilitar el mantenimiento futuro.

* [ ] **Limpieza del Proyecto**
  * [ ] Eliminar componentes (`.tsx`, `.css`) duplicados del directorio raíz.
  * [ ] Eliminar archivos de servicios (`.ts`) duplicados del directorio raíz.
  * [ ] Eliminar archivos HTML estáticos (`crypto_...html`) que ya no se usan.
* [ ] **Creación del Servidor Proxy**
  * [ ] Crear el directorio `server` en la raíz del proyecto.
  * [ ] Crear el archivo `server/package.json` con las dependencias (`express`, `cors`, `dotenv`, `@google/generative-ai`).
  * [ ] Ejecutar `npm install` dentro de la carpeta `server`.
  * [ ] Crear el archivo `server/.env` y añadir la `GEMINI_API_KEY`.
  * [ ] Añadir `server/.env` al archivo `.gitignore` para no exponer la clave.
  * [ ] Crear el archivo `server/index.js` con el código del servidor Express.
  * [ ] Iniciar el servidor (`npm run dev` en la carpeta `server`) y verificar que funciona.

### ✅ Fase 2: Refactorización y Mejora del Frontend

Ahora que el backend está listo, actualizamos el frontend para que lo use y para que sea más eficiente con la gestión de datos.

* [ ] **Actualizar Dependencias del Frontend**
  * [ ] Añadir `@tanstack/react-query` y `zustand` al `package.json` principal.
  * [ ] Ejecutar `npm install` en la raíz del proyecto.
* [ ] **Integrar React Query**
  * [ ] Envolver la aplicación con `QueryClientProvider` en `src/index.tsx`.
  * [ ] Refactorizar `src/utils/apiClient.ts` para usar `useQuery` (`useCryptoData`) y `useMutation` (`useGenerateAnalysis`).
* [ ] **Conectar Frontend con el Servidor Proxy**
  * [ ] Modificar `src/services/geminiService.ts` para que haga la petición `fetch` a `http://localhost:3001/api/generate-analysis`.
* [ ] **Refactorizar Componentes Principales**
  * [ ] Actualizar `src/App.tsx` para que use la nueva estructura de componentes y estado simplificado.
  * [ ] Actualizar `src/components/CryptoTable.tsx` para que use el hook `useCryptoData`.
  * [ ] Actualizar `src/components/AnalysisSection.tsx` para que use el hook `useGenerateAnalysis`.

### ✅ Fase 3: Mejoras de Experiencia de Usuario (UX)

Con la lógica principal refactorizada, nos centramos en hacer la aplicación más amigable e informativa para el usuario.

* [ ] **Añadir Indicadores de Carga**
  * [ ] Implementar el estado `isLoading` de `useCryptoData` en `CryptoTable.tsx` para mostrar un componente "skeleton" o un mensaje de carga.
  * [ ] Implementar el estado `isPending` de `useGenerateAnalysis` en `AnalysisSection.tsx` para mostrar un feedback de "Generando..." en el botón y en el área de resultados.
* [ ] **Añadir Manejo de Errores**
  * [ ] Implementar el estado `isError` de `useCryptoData` en `CryptoTable.tsx` para mostrar un mensaje de error claro si la API de CoinGecko falla.
  * [ ] Implementar el estado `isError` de `useGenerateAnalysis` en `AnalysisSection.tsx` para informar al usuario si el análisis de IA no se pudo generar.

### ✅ Fase 4: Nuevas Funcionalidades (Próximos Pasos)

Una vez que la base de la aplicación sea sólida, se pueden explorar estas nuevas características.

* [ ] **Página de Detalles de Criptomoneda**
* [ ] **Búsqueda y Filtros en la Tabla**
* [ ] **Modo Oscuro/Claro**
* [ ] **Persistencia de Datos con `localStorage` o Backend**
