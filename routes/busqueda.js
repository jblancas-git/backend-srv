
var express = require('express');
var app     = express();

var Hospital = require('../models/hospital');
var Medico   = require('../models/medico');
var Usuario  = require('../models/usuario');


//----------------------------
// Busqueda por colecciones
//-----------------------------

app.get('/coleccion/:tabla/:buscar', (req, res, next)=> {

    var tabla  = req.params.tabla;
    var buscar = req.params.buscar;
    var prmBuscar = new RegExp(buscar, 'i');


    var resPromesa;

    switch (tabla) {
        case 'usuarios':
            resPromesa =  buscarUsuario(prmBuscar);
        break;
        
        case 'medicos':
            resPromesa = buscarMedico(prmBuscar);
        break;

        case 'hospitales':
            resPromesa = buscarHospital(prmBuscar);
        break;
    
        default:
            return res.status(400).json({
                ok:false, 
                mensaje: 'Las colecciones válidas son: usuarios, medicos y hospitales!',
                error: { message: 'Tipo de coleccion/tabla no válido!'}
            });
    }

    // Si todo salió bien, regresamos respuesta

    resPromesa.then( data =>{
        res.status(200).json({
            ok:true,
            [tabla]: data
        });
    });

});


//----------------------------
// Busqueda General
//-----------------------------

app.get('/todo/:buscar', (req, res, next)=>{

    var buscar = req.params.buscar;
    var prmBuscar = new RegExp(buscar, 'i');

    // Ejectuar varias promesas al mismo tiempo
    Promise.all([
        buscarHospital(prmBuscar),
        buscarMedico(prmBuscar),
        buscarUsuario(prmBuscar)
    ]).then( respuesta => {
        
        res.status(200).json({
            ok:true,
            hospitales: respuesta[0],
            medicos: respuesta[1],
            usuarios: respuesta[2]
        });
    });
});

function buscarHospital( buscar ){

    return new Promise((resolve, reject )=> {
        Hospital.find({nombre: buscar})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales)=> {
                if (err){
                    reject( 'Error al buscar hospitales : ', err);
                }
                else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedico( buscar ){

    return new Promise((resolve, reject )=> {
        Medico.find({nombre: buscar})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos)=> {
                if (err){
                    reject( 'Error al buscar medicos: ', err);
                }
                else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuario( buscar ){
    return new Promise((resolve, reject )=> {
        Usuario.find({}, 'nombre email role').or([{'nombre': buscar}, { 'email': buscar}])
            .exec((err, usuarios)=> {

                if (err) {
                    reject('Error al cargar usuarios:', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;