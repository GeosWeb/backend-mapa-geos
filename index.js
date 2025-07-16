require('dotenv').config();
const express = require('express');
const { listarArchivosEnCarpeta, descargarArchivo } = require('./driveService');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/kmz-list', async (req, res) => {
  try {
    const archivos = await listarArchivosEnCarpeta(process.env.FOLDER_ID);
    res.json(archivos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al listar archivos');
  }
});

app.get('/kmz/:id', async (req, res) => {
  try {
    const stream = await descargarArchivo(req.params.id);
    res.setHeader('Content-Type', 'application/vnd.google-earth.kmz');
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al descargar archivo');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
