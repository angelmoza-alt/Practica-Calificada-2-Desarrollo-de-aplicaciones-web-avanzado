// Validaciones del lado del servidor (el frontend también valida antes de enviar)
const db = require('../models');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_RE = /^[a-zA-Z0-9_.]{3,30}$/;
const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

const responder = (res, errors, next) =>
  Object.keys(errors).length ? res.status(400).json({ message: 'Datos inválidos', errors }) : next();

const validarRegistro = async (req, res, next) => {
  const { username, email, password } = req.body || {};
  const errors = {};
  if (!USERNAME_RE.test(username || '')) errors.username = 'Usuario de 3 a 30 caracteres (letras, números, _ o .)';
  if (!EMAIL_RE.test(email || '')) errors.email = 'Email inválido';
  if (!password || password.length < 6 || password.length > 40) errors.password = 'La contraseña debe tener entre 6 y 40 caracteres';
  if (Object.keys(errors).length) return responder(res, errors, next);

  // Usuario o email duplicados
  if (await db.user.findOne({ where: { username } })) errors.username = 'El usuario ya está en uso';
  if (await db.user.findOne({ where: { email } })) errors.email = 'El email ya está registrado';
  return responder(res, errors, next);
};

const validarLogin = (req, res, next) => {
  const { username, password } = req.body || {};
  const errors = {};
  if (isBlank(username)) errors.username = 'Ingresa tu usuario';
  if (isBlank(password)) errors.password = 'Ingresa tu contraseña';
  return responder(res, errors, next);
};

const validarLaboratorio = (req, res, next) => {
  const b = req.body || {};
  const errors = {};
  if (isBlank(b.razonSocial) || b.razonSocial.trim().length < 3) errors.razonSocial = 'Mínimo 3 caracteres';
  if (isBlank(b.direccion)) errors.direccion = 'La dirección es obligatoria';
  if (!/^[0-9+\- ]{6,15}$/.test(b.telefono || '')) errors.telefono = 'Teléfono de 6 a 15 dígitos';
  if (!EMAIL_RE.test(b.email || '')) errors.email = 'Email inválido';
  if (isBlank(b.contacto)) errors.contacto = 'El contacto es obligatorio';
  return responder(res, errors, next);
};

const validarMedicamento = (req, res, next) => {
  const b = req.body || {};
  const errors = {};
  if (isBlank(b.descripcionMed) || b.descripcionMed.trim().length < 3) errors.descripcionMed = 'Mínimo 3 caracteres';
  if (isBlank(b.fechaFabricacion)) errors.fechaFabricacion = 'Fecha obligatoria';
  if (isBlank(b.fechaVencimiento)) errors.fechaVencimiento = 'Fecha obligatoria';
  else if (b.fechaFabricacion && b.fechaVencimiento <= b.fechaFabricacion)
    errors.fechaVencimiento = 'Debe ser posterior a la fecha de fabricación';
  if (isBlank(b.presentacion)) errors.presentacion = 'La presentación es obligatoria';
  if (!Number.isInteger(Number(b.stock)) || Number(b.stock) < 0) errors.stock = 'Entero mayor o igual a 0';
  if (isBlank(b.precioVentaUni) || isNaN(b.precioVentaUni) || Number(b.precioVentaUni) < 0) errors.precioVentaUni = 'Precio inválido';
  if (isBlank(b.precioVentaPres) || isNaN(b.precioVentaPres) || Number(b.precioVentaPres) < 0) errors.precioVentaPres = 'Precio inválido';
  if (isBlank(b.marca)) errors.marca = 'La marca es obligatoria';
  if (!Number.isInteger(Number(b.codLab)) || Number(b.codLab) <= 0) errors.codLab = 'Selecciona un laboratorio';
  return responder(res, errors, next);
};

module.exports = { validarRegistro, validarLogin, validarLaboratorio, validarMedicamento };
