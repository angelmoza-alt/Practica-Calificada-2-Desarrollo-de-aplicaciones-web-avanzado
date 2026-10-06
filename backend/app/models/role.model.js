module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    'roles',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      name: { type: Sequelize.STRING(20), allowNull: false, unique: true },
    },
    { timestamps: false }
  );
