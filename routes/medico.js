

var express =  require('express');
var mdAuth = require('../middlewares/validartoken');
var app = express();


// Usar schema de medico
var Medico = require('../models/medico');

//============================================
//  GET: Obtener todos los Medicoes
//============================================
app.get('/', (req, res, next)=>{

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos ) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    menasje: 'Error Medicos.find()',
                    errors:  err
                });
            }

            res.status(200).json({
                ok:true,
                medicos: medicos
            });
        });
});

//============================================
//  POST: Crear nuevo Medico
//============================================

app.post('/', mdAuth.verificaToken,  (req, res )=> {
    
    // Obtener parametros
    var body = req.body;

    // Crear nuevo usuario
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    // Guardar usuario en Mongodb
    medico.save((err, newMedico ) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                menasje: 'Error medico.save()',
                errors:  err
            });
        }

        res.status(201).json({
            ok:true,
            medico: newMedico
        });

    });
});



//============================================
//  PUT: Actualizar Medico
//============================================

app.put('/:id', mdAuth.verificaToken, (req, res)=> {

    var id = req.params.id;
    // Obtener body del put.
    var body = req.body;

    Medico.findById(id, (err, medico )=> {
        
        if (err) {
            return res.status(500).json({
                ok:false,
                menasje: 'Error medico.findByID()',
                errors:  err
            });
        }
        // Validar que sea medico valido
        if (! medico ) {
            return res.status(400).json({
                ok: false,
                menasje: `El medico con el id: ${id} no existe!` ,
                errors: {message: 'No existe el medico'}
            });
        }

        //Si todo es correcto modificamos medico
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, updMedico)=> {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Errro al actualizar usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok:true,
                    medico: updMedico
                });
            });
        });

});

//============================================
//  DELETE: Borrar Medico
//============================================

app.delete('/:id', mdAuth.verificaToken, (req, res)=>{

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, delMedico)=> {
        if (err) {
            return res.status(500).json({
                ok:false,
                menasje: 'Error medico.findByID()',
                errors:  err
            });
        }//if

        // Validar que sea medico valido
        if (! delMedico ) {
            return res.status(400).json({
                ok: false,
                menasje: `El medico con el id: ${id} no existe!` ,
                errors: {message: 'No existe el medico!'}
            });
        }// if

        res.status(200).json({
            ok:true,
            medico: delMedico
        });
    });
});


module.exports = app;
