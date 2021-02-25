const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');

exports.auntenticarUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() })
    }
    //extraer el emay y password
    const { email, password } = req.body;
    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }
        //Revisar password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password incorrecto' });
        }

        //crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id,
            }
        };
        //firmar jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error

            //mensaje de confirmacion
            return res.json({ token })
        });
    } catch (error) {
        console.log(error)
    }

}
//Obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        console.log(usuario)
        res.json({ usuario })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' })
    }
}