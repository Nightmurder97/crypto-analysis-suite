import { defineConfig, loadEnv } from 'vite';

// const __filename = fileURLToPath(import.meta.url); // Not used
// const __dirname = path.dirname(__filename); // Not used

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.COINGECKO_API_KEY': JSON.stringify(env.COINGECKO_API_KEY)
      },
      server: {
        proxy: {
          '/api/coingecko': {
            target: 'https://api.coingecko.com/api/v3',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/coingecko/, ''),
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; crypto-analysis-suite/1.0)'
            }
          }
        }
      }
    };
});
