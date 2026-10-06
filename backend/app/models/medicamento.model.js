// Tabla Medicamento (basada en el diagrama de bd_farmacia del laboratorio)
module.exports = (sequelize, Sequelize) =>
  sequelize.define('medicamento', {
    codMedicamento: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    descripcionMed: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'La descripción es obligatoria' } },
    },
    fechaFabricacion: { type: Sequelize.DATEONLY, allowNull: false },
    fechaVencimiento: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        posteriorAFabricacion(value) {
          if (this.fechaFabricacion && value <= this.fechaFabricacion) {
            throw new Error('La fecha de vencimiento debe ser posterior a la de fabricación');
          }
        },
      },
    },
    presentacion: { type: Sequelize.STRING(50), allowNull: false },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: 'El stock no puede ser negativo' } },
    },
    precioVentaUni: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'El precio no puede ser negativo' } },
    },
    precioVentaPres: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'El precio no puede ser negativo' } },
    },
    marca: { type: Sequelize.STRING(50), allowNull: false },
  });
