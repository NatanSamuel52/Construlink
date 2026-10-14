const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({
      mensagem: 'Autenticação necessária.',
    });
  }

  const token = cabecalho.slice(7);

  try {
    const dadosToken = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: dadosToken.sub,
      papel: dadosToken.papel,
    };

    return next();
  } catch (erro) {
    return res.status(401).json({
      mensagem: 'Token inválido ou expirado.',
    });
  }
}

module.exports = autenticar;
