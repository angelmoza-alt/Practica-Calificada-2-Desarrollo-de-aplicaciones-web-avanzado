const db = require('../models');
const { user: User, role: Role, laboratorio: Laboratorio, medicamento: Medicamento } = db;

const conRoles = { model: Role, attributes: ['name'], through: { attributes: [] } };
const formatear = (u) => ({
  id: u.id,
  username: u.username,
  email: u.email,
  createdAt: u.createdAt,
  roles: u.roles.map((r) => r.name),
});

// GET /api/users/me -> perfil del usuario logueado
exports.me = async (req, res) => {
  const u = await User.findByPk(req.userId, { include: conRoles });
  res.json(formatear(u));
};

// GET /api/users/stats -> números para el menú principal
exports.stats = async (req, res) => {
  const [laboratorios, medicamentos, usuarios, stockBajo] = await Promise.all([
    Laboratorio.count(),
    Medicamento.count(),
    User.count(),
    Medicamento.count({ where: { stock: { [db.Sequelize.Op.lt]: 100 } } }),
  ]);
  res.json({ laboratorios, medicamentos, usuarios, stockBajo });
};

// GET /api/users  (admin) -> lista de usuarios con sus roles
exports.findAll = async (req, res) => {
  const users = await User.findAll({ include: conRoles, order: [['id', 'ASC']] });
  res.json(users.map(formatear));
};

// PUT /api/users/:id/roles  (admin) -> cambiar roles de un usuario
exports.updateRoles = async (req, res) => {
  const roles = Array.isArray(req.body.roles) ? req.body.roles : [];
  if (!roles.length || roles.some((r) => !db.ROLES.includes(r))) {
    return res.status(400).json({ message: 'Roles inválidos' });
  }
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ message: 'Usuario no encontrado' });
  if (u.id === req.userId && !roles.includes('admin')) {
    return res.status(400).json({ message: 'No puedes quitarte el rol de administrador a ti mismo' });
  }
  const finales = Array.from(new Set(['user', ...roles]));
  await u.setRoles(await Role.findAll({ where: { name: finales } }));
  const actualizado = await User.findByPk(u.id, { include: conRoles });
  res.json(formatear(actualizado));
};

// DELETE /api/users/:id  (admin)
exports.remove = async (req, res) => {
  if (Number(req.params.id) === req.userId) {
    return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
  }
  const n = await User.destroy({ where: { id: req.params.id } });
  if (!n) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json({ message: 'Usuario eliminado' });
};
