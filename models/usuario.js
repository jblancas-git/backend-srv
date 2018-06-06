var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Definir Schema del modelo
var usuarioSchema = new Schema({
    nombre:  { type: String, required: [true, 'El nombre es requerido']},
    email:  { type: String, unique:true, required: [true, 'El email es requerido']},
    password:  { type: String, required: [true, 'La contraseña es requerida']},
    img:  { type: String},
    role:  { type: String, required:true, default:'USER_ROLE'}
});

// Exportar
module.exports = mongoose.model('Usuario', usuarioSchema);