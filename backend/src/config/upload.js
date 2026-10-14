const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const diretorioUploads = path.resolve(__dirname, '../../uploads');

const formatosPermitidos = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

const armazenamento = multer.diskStorage({
  destination: (req, arquivo, callback) => {
    callback(null, diretorioUploads);
  },

  filename: (req, arquivo, callback) => {
    const extensao = formatosPermitidos[arquivo.mimetype];
    const nomeArquivo = `${crypto.randomUUID()}${extensao}`;

    callback(null, nomeArquivo);
  },
});

const uploadTrabalho = multer({
  storage: armazenamento,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, arquivo, callback) => {
    if (!formatosPermitidos[arquivo.mimetype]) {
      return callback(
        new Error('Formato inválido. Envie uma imagem PNG, JPG ou WEBP.'),
      );
    }

    callback(null, true);
  },
});

module.exports = uploadTrabalho;