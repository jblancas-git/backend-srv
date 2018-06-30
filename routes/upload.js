

var express =  require('express');
var fileUpload = require('express-fileupload');

// Recursos del FileSystem de node.js
var fs = require('fs');

var app = express();

// default options
app.use(fileUpload());

// Importar modelos para manipular schemas
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Endpoint
app.put('/:tipo/:id', (req, res, next)=>{

    var tipo = req.params.tipo;
    var id = req.params.id;


    if (!req.files){
        return res.status(400).json({
            ok:false,
            mensaje: 'No existe ningún archivo!',
            errors: { message: 'Se requiere un archivo!.'}
        });
    }

    // Obtener datos del archivo

    var archivo = req.files.imagen;
    var nombreSplit = archivo.name.split('.');
    var extension = nombreSplit[ nombreSplit.length -1];

    // Validar extensiones 
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok:false,
            mensaje: 'Extensión no válida!',
            errors: { message: 'Las extensiones válidas son:' +  extValidas }
        });
    }

    // Crear nombre de archivo en servidor
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    // Generar ruta del archivo
    var pathFile = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover archivo a su ruta
    archivo.mv( pathFile, (err)=> {
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipoFile(tipo, id, nombreArchivo, res);

        /* res.status(200).json({
            ok:true,
            msg: 'Carga exitosa de archivo!',
            extension: extension
        }); */


    });
});

function subirPorTipoFile( tipo, id, nombreArchivo, res){
    
    if (tipo === 'usuarios'){
        
        Usuario.findById(id, (err, usuario )=> {

            if (!usuario) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Usuario no existe',
                    errors: { message:'Usuario no existe'}
                });
            }
           
            // Generar ruta del archico actual
            var curImage = './uploads/usuarios/' + usuario.img;

            // Si existe, se elimina
            if (fs.existsSync( curImage )){
                fs.unlink(curImage);
            }

            // Actualizamos el dato
            usuario.img = nombreArchivo;

            //Guardamos cambios

            usuario.save((err, uptUsuario)=> {
                
                if (err) {
                    return res.status(400).json({
                        ok:false,
                        mensaje: 'No se pudo actualizar la imagen del usuario!',
                        errors: err
                    });
                }

                // No mostrar contraseña
                uptUsuario.password = ';)';

                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de usuario actalizada!',
                    usuairo: uptUsuario
                });

            });
        });
    }
    
    if (tipo === 'medicos'){

        Medico.findById(id, (err, medico )=> {

            if (!medico) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Medico no existe',
                    errors: { message:'Medico no existe'}
                });
            }
           
            // Generar ruta del archico actual
            var curImage = './uploads/medicos/' + medico.img;

            // Si existe, se elimina
            if (fs.existsSync( curImage )){
                fs.unlink(curImage);
            }

            // Actualizamos el dato
            medico.img = nombreArchivo;

            //Guardamos cambios

            medico.save((err, uptMedico)=> {
                
                if (err) {
                    return res.status(400).json({
                        ok:false,
                        mensaje: 'No se pudo actualizar la imagen del medico!',
                        errors: err
                    });
                }

            
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de medico actalizada!',
                    medico: uptMedico
                });

            });
        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital )=> {

            if (!hospital) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Hospital no existe',
                    errors: { message:'Hospital no existe'}
                });
            }
           
            // Generar ruta del archico actual
            var curImage = './uploads/hospitales/' + hospital.img;

            // Si existe, se elimina
            if (fs.existsSync( curImage )){
                fs.unlink(curImage);
            }

            // Actualizamos el dato
            hospital.img = nombreArchivo;

            //Guardamos cambios

            hospital.save((err, uptHospital)=> {
                
                if (err) {
                    return res.status(400).json({
                        ok:false,
                        mensaje: 'No se pudo actualizar la imagen del hospital!',
                        errors: err
                    });
                }

            
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de hospital actualizada!',
                    hospital: uptHospital
                });

            });
        });
    }


}

module.exports = app;
