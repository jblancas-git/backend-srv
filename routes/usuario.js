

var express =  require('express');
// Para encriptar contraseña
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var mdAuth = require('../middlewares/validartoken');

var app = express();

//

// Usar schema de usuario
var Usuario = require('../models/usuario');

//============================================
//  Obtener todos los usuarios
//============================================
app.get('/', (req, res, next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
        (err, usuarios ) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    menasje: 'Error Usuario.find()',
                    errors:  err
                });
            }

            //Obetner el total de registros
            Usuario.count({}, (err, rowCount)=> {
                res.status(200).json({
                    ok:true,
                    usuarios: usuarios,
                    totalDocs: rowCount
                });
    
            });

            
        });
});

//============================================
//  Crear nuevo usuario
//============================================

app.post('/', mdAuth.verificaToken,  (req, res )=> {
    
    // Obtener parametros
    var body = req.body;

    // Crear nuevo usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        img: body.img,
        role:   body.role
    });

    // Guardar usuario en Mongodb
    usuario.save((err, newUsuario ) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                menasje: 'Error usuario.save()',
                errors:  err
            });
        }

        res.status(201).json({
            ok:true,
            usuario: newUsuario
        });

    });


});



//============================================
//  Actualizar Usuario
//============================================

app.put('/:id', mdAuth.verificaToken, (req, res)=> {

    var id = req.params.id;
    // Obtener body del put.
    var body = req.body;

    Usuario.findById(id, (err, usuario )=> {
        
        if (err) {
            return res.status(500).json({
                ok:false,
                menasje: 'Error Usuario.findByID()',
                errors:  err
            });
        }
        // Validar que sea usuario valido
        if (! usuario ) {
            return res.status(400).json({
                ok: false,
                menasje: `El usuario con el id: ${id} no existe!` ,
                errors: {message: 'No existe el usuario'}
            });
        }

        //Si todo es correcto modificamos usuario
        usuario.nombre = body.nombre;
        usuario.email  = body.email;
        usuario.role   = body.role;

        usuario.save((err, updUsuario)=> {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Errro al actualizar usuario',
                    errors: err
                });
            }

            // Omitir el password
            usuario.password= ";)";

            res.status(200).json({
                ok:true,
                usuario: updUsuario
            });
        });
    });


});

module.exports = app;
