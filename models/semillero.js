let mongoose = require('mongoose')
let Schema = mongoose.Schema

let SemilleroSchema = Schema({
  nombre: { type: String, required: true },
  sigla: String,
  mision: String,
  vision: String,
  facultad: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
  
  id_docente_lider: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

  area_estudiada: {
    nombre: String,
    descripcion: String
  },

  lineas_investigacion: [{
    nombre: String,
    descripcion: String
  }]
}, { timestamps: true })

module.exports = mongoose.model('Semillero', SemilleroSchema, 'semilleros')