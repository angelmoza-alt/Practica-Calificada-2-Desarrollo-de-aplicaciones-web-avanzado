const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');

// Verifica que la petición traiga un JWT válido en el header "Authorization: Bearer <token>"
// (también acepta "x-access-token")
const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.headers['x-access-token'];

  if (!token) return res.status(403).json({ message: 'No se envió el token' });

  try {
    const decoded = jwt.verify(token, config.secret);
    const user = await db.user.findByPk(decoded.id, { include: { model: db.role, attributes: ['name'] } });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
    req.userId = user.id;
    req.userRoles = user.roles.map((r) => r.name);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'La sesión expiró, inicia sesión otra vez' : 'Token inválido';
    return res.status(401).json({ message: msg });
  }
};

// Permite el acceso solo si el usuario tiene alguno de los roles indicados
const hasRole = (...allowed) => (req, res, next) => {
  if (req.userRoles?.some((r) => allowed.includes(r))) return next();
  return res.status(403).json({ message: `Requiere rol: ${allowed.join(' o ')}` });
};

module.exports = {
  verifyToken,
  hasRole,
  isAdmin: hasRole('admin'),
  isModeratorOrAdmin: hasRole('moderator', 'admin'),
};
