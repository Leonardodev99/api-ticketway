export default function roleMiddleware(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Acesso negado: perfil sem permissão'
      });
    }

    return next();
  };
}
