const router = require('express').Router();
const { verifyToken, isAdmin, isModeratorOrAdmin } = require('../middlewares/authJwt');
const { validarLaboratorio } = require('../middlewares/validators');
const controller = require('../controllers/laboratorio.controller');

// Todas las rutas requieren JWT
router.use(verifyToken);

router.get('/', controller.findAll);                                          // cualquier usuario
router.get('/:id', controller.findOne);                                       // cualquier usuario
router.post('/', isModeratorOrAdmin, validarLaboratorio, controller.create);        // moderador o admin
router.put('/:id', isModeratorOrAdmin, validarLaboratorio, controller.update);      // moderador o admin
router.delete('/:id', isAdmin, controller.remove);                            // solo admin

module.exports = router;
