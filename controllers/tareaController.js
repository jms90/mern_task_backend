const tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator');
const Tarea = require('../models/Tarea');

exports.crearTarea = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() })
    }
    try {
        //extraer proyecto y comprobar si existe
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        //revisar si es propietario del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(404).json({ msg: 'no autorizado' })
        }
        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json(tarea);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}
//obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        //extraer proyecto y comprobar si existe
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        //revisar si es propietario del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: 'no autorizado' })
        }
        //obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}
//actualizar tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //extraer proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;
        //si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea' })
        }
        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        //si el proyecto actual permanece al usuario auth
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: 'no autorizado' })
        }
        //Si la tarea existe
        //crear objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //guardar Tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea })
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//se elimina una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //extraer proyecto y comprobar si existe
        const { proyecto } = req.query;
        //si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea' })
        }
        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        //si el proyecto actual permanece al usuario auth
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: 'no autorizado' })
        }
        //eliminar 
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' })
        //guardar Tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea })
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}