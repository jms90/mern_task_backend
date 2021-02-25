const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')
exports.crearProyecto = async (req, res) => {

    //revisar errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() })
    }
    try {
        //proyecto
        const proyecto = Proyecto(req.body);
        //guardar el creador via jwt
        proyecto.creador = req.usuario.id;
        //guardamos el proyecto
        proyecto.save();
        res.json(proyecto)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Update proyecto
exports.actualizarProyecto = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() })
    }
    //extraer informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }
    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        //revisar si el proyecto existe
        if (!proyecto) {
            res.status(404).json({ msg: 'Proyecto no encontrado' })
        }
        //verificar creadro del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(404).json({ msg: 'no autorizado' })
        }

        //actualizar proyecto
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json({ proyecto });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}
//elimina proyecto
exports.eliminarProyecto = async (req, res) => {

    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        //revisar si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }
        //verificar creadro del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(404).json({ msg: 'no autorizado' })
        }

        //Eliminar proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto Eliminado' })
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}