var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}: No es un rol permitido'
}

// Definir Schema del modelo
var usuarioSchema = new Schema({
    nombre:  { type: String, required: [true, 'El nombre es requerido']},
    email:  { type: String, unique:true, required: [true, 'El email es requerido']},
    password:  { type: String, required: [true, 'La contraseña es requerida']},
    img:  { type: String},
    role:  { type: String, required:true, default:'USER_ROLE', enum: rolesValidos },
    google: {type: boolean, default:false}
});

usuarioSchema.plugin(uniqueValidator, { message:  '{PATH} debe ser único'});

// Exportar
module.exports = mongoose.model('Usuario', usuarioSchema);