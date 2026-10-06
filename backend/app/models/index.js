const { Sequelize } = require('sequelize');
const config = require('../config/db.config');

// Opciones comunes de conexión (se reutilizan al crear la base de datos)
const baseOptions = {
  host: config.HOST,
  port: config.PORT,
  dialect: config.dialect,
  logging: false,
  pool: config.pool,
  dialectOptions: config.SSL ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  define: { freezeTableName: true },
  timezone: '-05:00',
};

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, baseOptions);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.baseOptions = baseOptions;

// ----- Modelos -----
db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.laboratorio = require('./laboratorio.model')(sequelize, Sequelize);
db.medicamento = require('./medicamento.model')(sequelize, Sequelize);

// ----- Relaciones -----
// Usuarios <-> Roles  (muchos a muchos, tabla intermedia user_roles)
db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId' });
db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId' });

// Laboratorio 1 ---- N Medicamento  (las 2 tablas relacionadas de bd_farmacia)
db.laboratorio.hasMany(db.medicamento, {
  foreignKey: { name: 'codLab', allowNull: false },
  as: 'medicamentos',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
db.medicamento.belongsTo(db.laboratorio, {
  foreignKey: { name: 'codLab', allowNull: false },
  as: 'laboratorio',
});

db.ROLES = ['user', 'moderator', 'admin'];

module.exports = db;
