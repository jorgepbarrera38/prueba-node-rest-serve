

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator')

let categoriaSchema = new Schema({
 descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
 usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

categoriaSchema.plugin(uniqueValidator, {message:'La categoría ya está tomada'})

module.exports = mongoose.model('Categoria', categoriaSchema);