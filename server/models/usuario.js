const mongoose = require('mongoose')
const Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator')

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let usuarios = new Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ]
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: [true, 'El email ya está tomado']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarios.methods.toJSON = function(){
    let User = this;
    let UserObject = User.toObject()
    delete UserObject.password;
    return UserObject
}

usuarios.plugin(uniqueValidator, { message: 'El email ya está tomado' })


module.exports = mongoose.model('Usuario', usuarios)