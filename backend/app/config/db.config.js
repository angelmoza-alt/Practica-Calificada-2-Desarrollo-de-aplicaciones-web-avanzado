// Configuración de la conexión a MySQL (se lee del archivo .env)
module.exports = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: Number(process.env.DB_PORT) || 3306,
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || '',
  DB: process.env.DB_NAME || 'bd_farmacia',
  SSL: process.env.DB_SSL === 'true',
  dialect: 'mysql',
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
};
