// Manejo centralizado de errores (buena práctica: no repetir try/catch en cada controlador)
module.exports = (err, req, res, next) => {
  switch (err.name) {
    case 'SequelizeValidationError':
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: Object.fromEntries(err.errors.map((e) => [e.path, e.message])),
      });
    case 'SequelizeUniqueConstraintError':
      return res.status(409).json({ message: 'Ya existe un registro con ese valor', errors: Object.fromEntries(err.errors.map((e) => [e.path, 'Ya existe'])) });
    case 'SequelizeForeignKeyConstraintError':
      return res.status(409).json({ message: 'No se puede completar: el registro está relacionado con otros datos' });
    default:
      console.error(err);
      return res.status(err.status || 500).json({ message: err.status ? err.message : 'Error interno del servidor' });
  }
};
