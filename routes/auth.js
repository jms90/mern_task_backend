//Rutas para auntentificar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController')
//iniciarsesion
// api/auth
router.post('/',

    authController.auntenticarUsuario
);
//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);
module.exports = router;