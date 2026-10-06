// Validaciones del FRONT-END: se ejecutan antes de enviar los datos al back-end
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_RE = /^[a-zA-Z0-9_.]{3,30}$/;
const vacio = (v) => v === undefined || v === null || String(v).trim() === '';

export const validarLogin = ({ username, password }) => {
  const e = {};
  if (vacio(username)) e.username = 'Ingresa tu usuario';
  if (vacio(password)) e.password = 'Ingresa tu contraseña';
  return e;
};

export const validarRegistro = ({ username, email, password, confirm }) => {
  const e = {};
  if (vacio(username)) e.username = 'El usuario es obligatorio';
  else if (!USERNAME_RE.test(username)) e.username = 'De 3 a 30 caracteres: letras, números, _ o .';
  if (vacio(email)) e.email = 'El email es obligatorio';
  else if (!EMAIL_RE.test(email)) e.email = 'Ingresa un email válido';
  if (vacio(password)) e.password = 'La contraseña es obligatoria';
  else if (password.length < 6 || password.length > 40) e.password = 'Entre 6 y 40 caracteres';
  if (confirm !== password) e.confirm = 'Las contraseñas no coinciden';
  return e;
};

export const validarLaboratorio = (d) => {
  const e = {};
  if (vacio(d.razonSocial) || d.razonSocial.trim().length < 3) e.razonSocial = 'Mínimo 3 caracteres';
  if (vacio(d.direccion)) e.direccion = 'La dirección es obligatoria';
  if (!/^[0-9+\- ]{6,15}$/.test(d.telefono || '')) e.telefono = 'Solo números, de 6 a 15 dígitos';
  if (!EMAIL_RE.test(d.email || '')) e.email = 'Ingresa un email válido';
  if (vacio(d.contacto)) e.contacto = 'El contacto es obligatorio';
  return e;
};

export const validarMedicamento = (d) => {
  const e = {};
  if (vacio(d.descripcionMed) || d.descripcionMed.trim().length < 3) e.descripcionMed = 'Mínimo 3 caracteres';
  if (vacio(d.fechaFabricacion)) e.fechaFabricacion = 'Selecciona la fecha';
  if (vacio(d.fechaVencimiento)) e.fechaVencimiento = 'Selecciona la fecha';
  else if (d.fechaFabricacion && d.fechaVencimiento <= d.fechaFabricacion)
    e.fechaVencimiento = 'Debe ser posterior a la fabricación';
  if (vacio(d.presentacion)) e.presentacion = 'La presentación es obligatoria';
  if (vacio(d.stock) || !Number.isInteger(Number(d.stock)) || Number(d.stock) < 0) e.stock = 'Entero mayor o igual a 0';
  if (vacio(d.precioVentaUni) || Number(d.precioVentaUni) < 0) e.precioVentaUni = 'Precio inválido';
  if (vacio(d.precioVentaPres) || Number(d.precioVentaPres) < 0) e.precioVentaPres = 'Precio inválido';
  if (vacio(d.marca)) e.marca = 'La marca es obligatoria';
  if (vacio(d.codLab)) e.codLab = 'Selecciona un laboratorio';
  return e;
};
