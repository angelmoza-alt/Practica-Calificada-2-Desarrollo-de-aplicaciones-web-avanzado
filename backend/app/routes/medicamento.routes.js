const router = require('express').Router();
const { verifyToken, isAdmin, isModeratorOrAdmin } = require('../middlewares/authJwt');
const { validarMedicamento } = require('../middlewares/validators');
const controller = require('../controllers/medicamento.controller');

// Todas las rutas requieren JWT
router.use(verifyToken);

router.get('/', controller.findAll);                                          // cualquier usuario
router.get('/:id', controller.findOne);                                       // cualquier usuario
router.post('/', isModeratorOrAdmin, validarMedicamento, controller.create);        // moderador o admin
router.put('/:id', isModeratorOrAdmin, validarMedicamento, controller.update);      // moderador o admin
router.delete('/:id', isAdmin, controller.remove);                            // solo admin

module.exports = router;
