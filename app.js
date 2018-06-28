// Archivo principal del proyecto.
// Para iniciar proyecto run:$ npm start

// Requieres Librerias
var express   = require('express');
var mongoose  = require('mongoose');

//
var bodyParser = require('body-parser')


//Inicializar variable principal
var app = express();

//========================
// -- BodyParser Config
//========================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes= require('./routes/busqueda');
var uploadRoutes= require('./routes/upload');
var imagenesRoutes= require('./routes/imagenes');


//Conexión mongoose
var mongoose = mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    //En caso de error se detiene todo
    if (err) throw err;

    // se muestra si no hay error
    console.log('Base de Datos online!');
});


//Rutas para escucha de verbos: get, post, del, etc.
app.use('/usuario', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagen', imagenesRoutes);


// Esta ruta siempre al final
app.use('/', appRoutes);


//Escuhcar peticiones

app.listen(3000, ()=> {
    console.log('Express server puerto 3000 online');
});