import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      error: 'Token não fornecido'
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);

    req.userId = dados.id;
    req.userEmail = dados.email;
    req.userRole = dados.role; // ✅ importante

    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      error: 'Token inválido ou expirado'
    });
  }
}
