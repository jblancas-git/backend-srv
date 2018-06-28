

var express =  require('express');
var mdAuth = require('../middlewares/validartoken');
var app = express();


// Usar schema de hospital
var Hospital = require('../models/hospital');

//============================================
//  GET: Obtener todos los Hospitales
//============================================
app.get('/', (req, res, next)=>{

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales ) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    menasje: 'Error Hospital.find()',
                    errors:  err
                });
            }

            res.status(200).json({
                ok:true,
                hospitales: hospitales
            });
        });
});

//============================================
//  POST: Crear nuevo Hospital
//============================================

app.post('/', mdAuth.verificaToken,  (req, res )=> {
    
    // Obtener parametros
    var body = req.body;

    // Crear nuevo usuario
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    // Guardar usuario en Mongodb
    hospital.save((err, newHospital ) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                menasje: 'Error usuario.save()',
                errors:  err
            });
        }

        res.status(201).json({
            ok:true,
            hospital: newHospital
        });

    });


});



//============================================
//  PUT: Actualizar Hospital
//============================================

app.put('/:id', mdAuth.verificaToken, (req, res)=> {

    var id = req.params.id;
    // Obtener body del put.
    var body = req.body;

    Hospital.findById(id, (err, hospital )=> {
        
        if (err) {
            return res.status(500).json({
                ok:false,
                menasje: 'Error hospital.findByID()',
                errors:  err
            });
        }
        // Validar que sea hospital valido
        if (! hospital ) {
            return res.status(400).json({
                ok: false,
                menasje: `El hospital con el id: ${id} no existe!` ,
                errors: {message: 'No existe el hospital'}
            });
        }

        //Si todo es correcto modificamos hospital
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, updHospital)=> {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Errro al actualizar usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok:true,
                    usuario: updHospital
                });
            });
        });

});

//============================================
//  DELETE: Borrar Hospital
//============================================

app.delete('/:id', mdAuth.verificaToken, (req, res)=>{

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, delHospital)=> {
        if (err) {
            return res.status(500).json({
                ok:false,
                menasje: 'Error hospital.findByID()',
                errors:  err
            });
        }//if

        // Validar que sea hospital valido
        if (! delHospital ) {
            return res.status(400).json({
                ok: false,
                menasje: `El hospital con el id: ${id} no existe!` ,
                errors: {message: 'No existe el hospital!'}
            });
        }// if

        res.status(200).json({
            ok:true,
            hospital: delHospital
        });

    });


});


module.exports = app;
