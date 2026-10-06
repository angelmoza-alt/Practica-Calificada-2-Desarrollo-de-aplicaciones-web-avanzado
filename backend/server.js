require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { initDatabase, describirError } = require('./app/database/init');
const errorHandler = require('./app/middlewares/errorHandler');

const app = express();

// ----- Middlewares globales -----
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim());
app.use(cors({ origin: origins }));
app.use(helmet());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ----- Rutas -----
app.get('/', (req, res) => res.json({ message: 'API Farmacia funcionando 🚀', docs: '/api' }));
app.get('/api', (req, res) =>
  res.json({
    auth: ['POST /api/auth/signup', 'POST /api/auth/signin'],
    users: ['GET /api/users/me', 'GET /api/users/stats', 'GET /api/users (admin)', 'PUT /api/users/:id/roles (admin)', 'DELETE /api/users/:id (admin)'],
    laboratorios: ['GET', 'GET /:id', 'POST (mod/admin)', 'PUT /:id (mod/admin)', 'DELETE /:id (admin)'],
    medicamentos: ['GET', 'GET /:id', 'POST (mod/admin)', 'PUT /:id (mod/admin)', 'DELETE /:id (admin)'],
  })
);
app.use('/api/auth', require('./app/routes/auth.routes'));
app.use('/api/users', require('./app/routes/user.routes'));
app.use('/api/laboratorios', require('./app/routes/laboratorio.routes'));
app.use('/api/medicamentos', require('./app/routes/medicamento.routes'));

app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use(errorHandler);

// ----- Arranque: crea BD, tablas, relaciones e inserta datos; luego escucha -----
const PORT = process.env.PORT || 8080;
initDatabase()
  .then(() => app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('❌ No se pudo conectar a MySQL:', describirError(err));
    process.exit(1);
  });
