// Tabla Laboratorio (basada en el diagrama de bd_farmacia del laboratorio)
module.exports = (sequelize, Sequelize) =>
  sequelize.define('laboratorio', {
    codLab: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    razonSocial: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'La razón social es obligatoria' } },
    },
    direccion: { type: Sequelize.STRING(150), allowNull: false },
    telefono: {
      type: Sequelize.STRING(15),
      allowNull: false,
      validate: { is: { args: /^[0-9+\- ]{6,15}$/, msg: 'Teléfono inválido' } },
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: { isEmail: { msg: 'Email inválido' } },
    },
    contacto: { type: Sequelize.STRING(80), allowNull: false },
  });
