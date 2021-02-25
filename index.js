const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors');
//Creación del servidor
const app = express();

//conectar DB
conectarDB();

//habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }))

//Puerto de la app
const PORT = process.env.PORT || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));
//run ap
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en en puerto ${PORT}`)
})