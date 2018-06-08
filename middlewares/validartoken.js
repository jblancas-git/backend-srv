
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//============================================
//  Verificar Token
//============================================

exports.verificaToken = function (req, res, next ) {
    var token = req.query.token;

    jwt.verify( token, SEED, (err, decoded )=> {
        if (err) {
            return res.status(401).json({
                ok:false,
                menasje: 'Error Token Invalido',
                errors:  err
            });
        }

        // Obtenemos Payload
        req.usuario = decoded.usuario;
        
        next();

    });

}
