// Configuración de JWT
module.exports = {
  secret: process.env.JWT_SECRET || 'clave-solo-para-desarrollo',
  expiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400, // 24 horas
};
