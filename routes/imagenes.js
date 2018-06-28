

var express =  require('express');
var app = express();

// The path module provides utilities for working with file and directory paths.
const path = require('path');

//The fs module provides an API for interacting with the file system.
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next)=>{

    var tipo = req.params.tipo;
    var img = req.params.img;

    // Generar ruta de archivo
    var pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    console.log( '>> PathImg: ', pathImg);

    //Revisar si existe la imagen solicitada
    if (!fs.existsSync(pathImg)) {
        pathImg = path.resolve (__dirname, '../assets/no-img.jpg');    
    }
    
    // Retornar imagen
    res.sendFile(pathImg);

    /* 
      -- Ya no se requiere
        res.status(200).json({
        ok:true,
        msg: 'GET:200: Respuesta correcta'
    });*/

});

module.exports = app;
