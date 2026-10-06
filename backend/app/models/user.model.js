module.exports = (sequelize, Sequelize) =>
  sequelize.define('users', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true,
      validate: { len: [3, 30] },
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: Sequelize.STRING(100), allowNull: false },
  });
