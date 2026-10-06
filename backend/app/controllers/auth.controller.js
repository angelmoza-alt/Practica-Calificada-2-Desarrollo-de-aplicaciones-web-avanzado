const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const config = require('../config/auth.config');

const { user: User, role: Role } = db;

// POST /api/auth/signup  -> registro (todo usuario nuevo recibe el rol "user")
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  const nuevo = await User.create({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: bcrypt.hashSync(password, 8),
  });
  const rolUser = await Role.findOne({ where: { name: 'user' } });
  await nuevo.setRoles([rolUser]);
  res.status(201).json({ message: '¡Usuario registrado correctamente! Ya puedes iniciar sesión.' });
};

// POST /api/auth/signin  -> login, devuelve el JWT
exports.signin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: { username: username.trim() },
    include: { model: Role, attributes: ['name'] },
  });

  // Mismo mensaje para usuario o contraseña incorrectos (no revela cuál falló)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign({ id: user.id }, config.secret, {
    algorithm: 'HS256',
    expiresIn: config.expiresIn,
  });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map((r) => 'ROLE_' + r.name.toUpperCase()),
    accessToken: token,
    expiresIn: config.expiresIn,
  });
};
