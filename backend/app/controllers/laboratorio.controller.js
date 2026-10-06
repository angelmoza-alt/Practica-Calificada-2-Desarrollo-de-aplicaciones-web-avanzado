const { Op } = require('sequelize');
const db = require('../models');
const { laboratorio: Laboratorio, medicamento: Medicamento } = db;

const campos = (b) => ({
  razonSocial: b.razonSocial?.trim(),
  direccion: b.direccion?.trim(),
  telefono: b.telefono?.trim(),
  email: b.email?.trim().toLowerCase(),
  contacto: b.contacto?.trim(),
});

// GET /api/laboratorios?q=texto  -> lista (con cantidad de medicamentos)
exports.findAll = async (req, res) => {
  const q = (req.query.q || '').trim();
  const where = q
    ? { [Op.or]: [{ razonSocial: { [Op.like]: `%${q}%` } }, { contacto: { [Op.like]: `%${q}%` } }] }
    : undefined;
  const data = await Laboratorio.findAll({
    where,
    attributes: {
      include: [[db.sequelize.fn('COUNT', db.sequelize.col('medicamentos.codMedicamento')), 'totalMedicamentos']],
    },
    include: { model: Medicamento, as: 'medicamentos', attributes: [] },
    group: ['laboratorio.codLab'],
    order: [['codLab', 'ASC']],
  });
  res.json(data);
};

// GET /api/laboratorios/:id  -> un laboratorio con sus medicamentos
exports.findOne = async (req, res) => {
  const lab = await Laboratorio.findByPk(req.params.id, {
    include: { model: Medicamento, as: 'medicamentos' },
  });
  if (!lab) return res.status(404).json({ message: 'Laboratorio no encontrado' });
  res.json(lab);
};

// POST /api/laboratorios
exports.create = async (req, res) => {
  const lab = await Laboratorio.create(campos(req.body));
  res.status(201).json(lab);
};

// PUT /api/laboratorios/:id
exports.update = async (req, res) => {
  const lab = await Laboratorio.findByPk(req.params.id);
  if (!lab) return res.status(404).json({ message: 'Laboratorio no encontrado' });
  await lab.update(campos(req.body));
  res.json(lab);
};

// DELETE /api/laboratorios/:id  (no se permite si tiene medicamentos)
exports.remove = async (req, res) => {
  const lab = await Laboratorio.findByPk(req.params.id);
  if (!lab) return res.status(404).json({ message: 'Laboratorio no encontrado' });
  const total = await Medicamento.count({ where: { codLab: lab.codLab } });
  if (total > 0) {
    return res.status(409).json({ message: `No se puede eliminar: tiene ${total} medicamento(s) asociado(s)` });
  }
  await lab.destroy();
  res.json({ message: 'Laboratorio eliminado' });
};
