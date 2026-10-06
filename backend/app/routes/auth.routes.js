const router = require('express').Router();
const { validarRegistro, validarLogin } = require('../middlewares/validators');
const controller = require('../controllers/auth.controller');

router.post('/signup', validarRegistro, controller.signup);
router.post('/signin', validarLogin, controller.signin);

module.exports = router;
