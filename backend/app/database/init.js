const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config/db.config');
const db = require('../models');

// Mensajes de error claros (en Windows algunos errores de conexión llegan sin texto)
const codigoError = (err) => err?.original?.code || err?.parent?.code || err?.code || err?.name;
const describirError = (err) => {
  const code = codigoError(err);
  const ayudas = {
    ECONNREFUSED: `MySQL no está encendido en ${config.HOST}:${config.PORT}. Inicia Docker (docker compose up -d) o MySQL en XAMPP.`,
    ER_ACCESS_DENIED_ERROR: 'Usuario o contraseña de MySQL incorrectos. Revisa DB_USER y DB_PASSWORD en el archivo .env',
    ETIMEDOUT: `No hubo respuesta de ${config.HOST}:${config.PORT}. Revisa DB_HOST y DB_PORT.`,
    ENOTFOUND: `No se encontró el host "${config.HOST}". Revisa DB_HOST.`,
  };
  return ayudas[code] || err?.message || code || String(err);
};

// 1) Crea la base de datos "bd_farmacia" usando Sequelize (si no existe)
async function crearBaseDeDatos() {
  const tmp = new Sequelize('', config.USER, config.PASSWORD, db.baseOptions);
  try {
    await tmp.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✔ Base de datos "${config.DB}" lista`);
  } catch (err) {
    // En algunos hostings el usuario no puede crear BDs; en ese caso se usa la existente
    if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'].includes(codigoError(err))) throw err;
    console.warn(`⚠ No se pudo crear la BD (${describirError(err)}). Se usará la existente.`);
  } finally {
    await tmp.close();
  }
}

// 2) Inserta registros iniciales en cada tabla usando Sequelize
async function insertarDatosIniciales() {
  const { role, user, laboratorio, medicamento } = db;

  // Roles
  if ((await role.count()) === 0) {
    await role.bulkCreate([
      { id: 1, name: 'user' },
      { id: 2, name: 'moderator' },
      { id: 3, name: 'admin' },
    ]);
    console.log('✔ Roles insertados');
  }

  // Usuarios de prueba (uno por rol)
  if ((await user.count()) === 0) {
    const pass = bcrypt.hashSync('123456', 8);
    const admin = await user.create({ username: 'admin', email: 'admin@farmacia.com', password: pass });
    const mod = await user.create({ username: 'moderador', email: 'moderador@farmacia.com', password: pass });
    const usr = await user.create({ username: 'usuario', email: 'usuario@farmacia.com', password: pass });
    await admin.setRoles([1, 2, 3]);
    await mod.setRoles([1, 2]);
    await usr.setRoles([1]);
    console.log('✔ Usuarios de prueba insertados (contraseña: 123456)');
  }

  // Laboratorios
  if ((await laboratorio.count()) === 0) {
    await laboratorio.bulkCreate([
      { razonSocial: 'Laboratorios Bagó del Perú S.A.', direccion: 'Av. Javier Prado Este 1234, San Isidro', telefono: '014221111', email: 'contacto@bago.com.pe', contacto: 'María Torres' },
      { razonSocial: 'Medifarma S.A.', direccion: 'Jr. Ecuador 787, Lima', telefono: '013325050', email: 'ventas@medifarma.com.pe', contacto: 'Carlos Ríos' },
      { razonSocial: 'Laboratorios Portugal S.R.L.', direccion: 'Av. Argentina 2560, Callao', telefono: '014519090', email: 'info@portugal.com.pe', contacto: 'Lucía Paredes' },
      { razonSocial: 'Farmindustria S.A.', direccion: 'Jr. Mariano Odicio 1170, Surquillo', telefono: '014413030', email: 'pedidos@farmindustria.com.pe', contacto: 'Jorge Salas' },
      { razonSocial: 'Hersil S.A.', direccion: 'Av. Los Frutales 220, Ate', telefono: '013490707', email: 'atencion@hersil.com.pe', contacto: 'Rosa Quispe' },
    ]);
    console.log('✔ Laboratorios insertados');
  }

  // Medicamentos (relacionados con un laboratorio por codLab)
  if ((await medicamento.count()) === 0) {
    await medicamento.bulkCreate([
      { descripcionMed: 'Paracetamol 500 mg', fechaFabricacion: '2026-01-10', fechaVencimiento: '2028-01-10', presentacion: 'Caja x 100 tabletas', stock: 250, precioVentaUni: 0.3, precioVentaPres: 25.0, marca: 'Panadol', codLab: 1 },
      { descripcionMed: 'Ibuprofeno 400 mg', fechaFabricacion: '2026-02-05', fechaVencimiento: '2028-02-05', presentacion: 'Caja x 50 tabletas', stock: 180, precioVentaUni: 0.5, precioVentaPres: 22.0, marca: 'Doloral', codLab: 2 },
      { descripcionMed: 'Amoxicilina 500 mg', fechaFabricacion: '2025-11-20', fechaVencimiento: '2027-11-20', presentacion: 'Caja x 100 cápsulas', stock: 120, precioVentaUni: 0.8, precioVentaPres: 70.0, marca: 'Amoxil', codLab: 3 },
      { descripcionMed: 'Loratadina 10 mg', fechaFabricacion: '2026-03-01', fechaVencimiento: '2028-03-01', presentacion: 'Caja x 30 tabletas', stock: 90, precioVentaUni: 0.6, precioVentaPres: 15.0, marca: 'Clarityne', codLab: 1 },
      { descripcionMed: 'Omeprazol 20 mg', fechaFabricacion: '2026-01-15', fechaVencimiento: '2028-01-15', presentacion: 'Caja x 100 cápsulas', stock: 300, precioVentaUni: 0.4, precioVentaPres: 35.0, marca: 'Losec', codLab: 4 },
      { descripcionMed: 'Jarabe para la tos 120 ml', fechaFabricacion: '2026-04-10', fechaVencimiento: '2027-10-10', presentacion: 'Frasco 120 ml', stock: 60, precioVentaUni: 18.5, precioVentaPres: 18.5, marca: 'Bisolvon', codLab: 5 },
      { descripcionMed: 'Naproxeno 550 mg', fechaFabricacion: '2026-02-20', fechaVencimiento: '2028-02-20', presentacion: 'Caja x 20 tabletas', stock: 75, precioVentaUni: 1.2, precioVentaPres: 22.0, marca: 'Apronax', codLab: 2 },
      { descripcionMed: 'Vitamina C 1 g', fechaFabricacion: '2026-05-01', fechaVencimiento: '2028-05-01', presentacion: 'Tubo x 10 efervescentes', stock: 140, precioVentaUni: 1.5, precioVentaPres: 13.0, marca: 'Redoxon', codLab: 4 },
    ]);
    console.log('✔ Medicamentos insertados');
  }
}

// Ejecuta todo: crear BD -> crear tablas y relaciones -> insertar datos
async function initDatabase({ force = false } = {}) {
  await crearBaseDeDatos();
  await db.sequelize.authenticate();
  await db.sequelize.sync({ force }); // crea las tablas y sus llaves foráneas
  console.log('✔ Tablas sincronizadas');
  await insertarDatosIniciales();
}

module.exports = { initDatabase, describirError };
