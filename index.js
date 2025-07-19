// Cargar variables de entorno
require('dotenv').config();

// Importar módulos necesarios
const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Autenticación con Google Drive usando cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'service-account.json'), // Asegúrate de que el archivo esté aquí
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

let drive; // la instancia se crea async más abajo

// Ruta para probar si el backend responde
app.get('/', (req, res) => {
  res.send('Backend activo y funcionando');
});

// Ruta para listar archivos de una carpeta de Drive
app.get('/list-files', async (req, res) => {
  try {
    // Autenticarse y crear el cliente de Drive
    const authClient = await auth.getClient();
    drive = google.drive({ version: 'v3', auth: authClient });

    const folderId = process.env.FOLDER_ID; // Debes agregar esto a tu archivo .env

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
