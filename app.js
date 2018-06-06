// Archivo principal del proyecto.
// Para iniciar proyecto run:$ npm start

// Requieres Librerias
var express   = require('express');
var mongoose  = require('mongoose');


//Inicializar variables
var app = express();


//Conexión mongoose
var mongoose = mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    //En caso de error se detiene todo
    if (err) throw err;

    // se muestra si no hay error
    console.log('Base de Datos online!');
});


//Rutas para escucha de verbos: get, post, del, etc.

app.get('/', (req, res, next)=>{
    res.status(200).json({
        ok:true,
        msg: 'Response 200'
    });
});


//Escuhcar peticiones

app.listen(3000, ()=> {
    console.log('Express server puerto 3000 online');
});