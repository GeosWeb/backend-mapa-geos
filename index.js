// Cargar variables de entorno
require('dotenv').config();

// Importar módulos necesarios
const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener credenciales desde variable de entorno
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

// Autenticación con Google Drive usando las credenciales
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

// Ruta para probar si el backend responde
app.get('/', (req, res) => {
  res.send('Backend activo y funcionando');
});

// Ruta para listar archivos de una carpeta de Drive
app.get('/list-files', async (req, res) => {
  try {
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const folderId = process.env.FOLDER_ID; // Esta variable también debe estar en Render

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name)',
    });

    res.json(response.data.files);
  } catch (error) {
    console.error('Error al listar archivos:', error.message);
    res.status(500).send('Error al acceder a Google Drive');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
