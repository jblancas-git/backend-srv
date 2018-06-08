
var express =  require('express');
// Para encriptar contraseña
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Obtener valor del config
var SEED = require('../config/config').SEED;

//Variable principal de la app.
var app = express();


// Usar schema de usuario
var Usuario = require('../models/usuario');

app.post('/', (req, res )=> {

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error: No hay usuario con ese correo',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Invalidas',
                errors: err
            });
        }

        // Validar contraseña

        if (! bcrypt.compareSync(body.password, usuarioDB.password)){
          return res.status(400).json({
              ok: false,
              mensaje: 'Credenciales Invalidas',
              errors: err
          });  
        }

        // Crear un Token
        usuarioDB.password = ';)';
        var token = jwt.sign({usuario: usuarioDB}, SEED, { expiresIn: 14400})

        res.status(200).json({
            ok:true,
            usuario: usuarioDB,
            id: usuarioDB._id,
            token
        });

    });

})

module.exports = app;