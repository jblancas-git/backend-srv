
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

//------------------------------
// Config Google SignIn
//------------------------------
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre : payload.name,
        email: payload.email,
        img: payload.picture,
        google : true
    }

  }

//------------------------------
// Login con Google Sign-In
// npm install google-auth-library --save
//------------------------------


app.post('/google', async (req, res)=> {

    var token = req.body.token;

    var googleUser = await verify(token).catch( e => {
        res.status(403).json({
            ok:false,
            mensaje: 'Token invalido'
        });
    });

    Usuario.findOne({ email:googleUser.email}, (err, oneUser)=> {

        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'No se encontró el usuario',
                errors: err
            });
        }

        // Si el usuario existe
        if (oneUser){
            // Si no es usuario google
            if (oneUser.google ===  false ){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Requiere autenticación Normal',
                });
            } else {
                // Crear un Token
                usuarioDB.password = ';)';
                var token = jwt.sign({usuario: usuarioDB}, SEED, { expiresIn: 14400})

                res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    id: usuarioDB._id,
                    token: token
                });
            }
        } else { // Si no existe... hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google= true;
            usuar.password = ':)';
        }

    });

    /* res.status(200).json({
        ok:true,
        mensaje: 'Login Ok',
        googleUser: googleUser
    });
    */


});



//------------------------------
// Login Normal
//------------------------------

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