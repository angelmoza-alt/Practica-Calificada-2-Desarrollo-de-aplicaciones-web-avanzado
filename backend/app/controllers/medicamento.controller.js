const { Op } = require('sequelize');
const db = require('../models');
const { medicamento: Medicamento, laboratorio: Laboratorio } = db;

const incluirLab = { model: Laboratorio, as: 'laboratorio', attributes: ['codLab', 'razonSocial'] };

const campos = (b) => ({
  descripcionMed: b.descripcionMed?.trim(),
  fechaFabricacion: b.fechaFabricacion,
  fechaVencimiento: b.fechaVencimiento,
  presentacion: b.presentacion?.trim(),
  stock: Number(b.stock),
  precioVentaUni: Number(b.precioVentaUni),
  precioVentaPres: Number(b.precioVentaPres),
  marca: b.marca?.trim(),
  codLab: Number(b.codLab),
});

const existeLab = async (codLab, res) => {
  if (await Laboratorio.findByPk(codLab)) return true;
  res.status(400).json({ message: 'Datos inválidos', errors: { codLab: 'El laboratorio no existe' } });
  return false;
};

// GET /api/medicamentos?q=texto&codLab=1  -> lista con su laboratorio (JOIN)
exports.findAll = async (req, res) => {
  const where = {};
  const q = (req.query.q || '').trim();
  if (q) where[Op.or] = [{ descripcionMed: { [Op.like]: `%${q}%` } }, { marca: { [Op.like]: `%${q}%` } }];
  if (req.query.codLab) where.codLab = Number(req.query.codLab);
  const data = await Medicamento.findAll({ where, include: incluirLab, order: [['codMedicamento', 'ASC']] });
  res.json(data);
};

// GET /api/medicamentos/:id
exports.findOne = async (req, res) => {
  const med = await Medicamento.findByPk(req.params.id, { include: incluirLab });
  if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
  res.json(med);
};

// POST /api/medicamentos
exports.create = async (req, res) => {
  const data = campos(req.body);
  if (!(await existeLab(data.codLab, res))) return;
  const med = await Medicamento.create(data);
  res.status(201).json(await Medicamento.findByPk(med.codMedicamento, { include: incluirLab }));
};

// PUT /api/medicamentos/:id
exports.update = async (req, res) => {
  const med = await Medicamento.findByPk(req.params.id);
  if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
  const data = campos(req.body);
  if (!(await existeLab(data.codLab, res))) return;
  await med.update(data);
  res.json(await Medicamento.findByPk(med.codMedicamento, { include: incluirLab }));
};

// DELETE /api/medicamentos/:id
exports.remove = async (req, res) => {
  const n = await Medicamento.destroy({ where: { codMedicamento: req.params.id } });
  if (!n) return res.status(404).json({ message: 'Medicamento no encontrado' });
  res.json({ message: 'Medicamento eliminado' });
};
