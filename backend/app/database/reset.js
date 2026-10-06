// Uso: npm run db:reset  -> borra y vuelve a crear las tablas con los datos iniciales
require('dotenv').config({ quiet: true });
const db = require('../models');
const { initDatabase } = require('./init');

initDatabase({ force: true })
  .then(() => console.log('✔ Base de datos reiniciada'))
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => db.sequelize.close());
