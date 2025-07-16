const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: 'mapageosweb-02c44a82746d.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

async function listarArchivosEnCarpeta(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
    fields: 'files(id, name, mimeType)',
  });
  return res.data.files;
}

async function descargarArchivo(fileId) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return res.data;
}

module.exports = {
  listarArchivosEnCarpeta,
  descargarArchivo,
};
