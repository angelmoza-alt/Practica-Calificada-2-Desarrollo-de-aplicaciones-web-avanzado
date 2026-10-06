const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middlewares/authJwt');
const controller = require('../controllers/user.controller');

router.use(verifyToken);
router.get('/me', controller.me);
router.get('/stats', controller.stats);
router.get('/', isAdmin, controller.findAll);
router.put('/:id/roles', isAdmin, controller.updateRoles);
router.delete('/:id', isAdmin, controller.remove);

module.exports = router;
