# 🏁 Instrucciones de Ejecución Rápida

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd crypto-analysis-suite
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la clave de Google Gemini:**
   - Crea un archivo `.env` en la raíz del proyecto.
   - Añade tu clave:
     ```
     GEMINI_API_KEY=TU_CLAVE_AQUI
     ```

4. **Inicia la aplicación:**
   ```bash
   npm run dev
   ```
   Accede a [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## ⚠️ Notas importantes

- **CORS CoinGecko:** Si ves errores de CORS al cargar datos, prueba desactivar restricciones de seguridad en tu navegador o usa una extensión temporal para permitir peticiones inseguras.
- **Límites de Gemini:** Si recibes el error `429 RESOURCE_EXHAUSTED`, tu clave ha superado el límite gratuito. Cambia de clave o usa otro proyecto de Google Cloud.

---

¿Dudas? Consulta el archivo `README.md` para más detalles sobre funcionalidades y estructura del proyecto. 