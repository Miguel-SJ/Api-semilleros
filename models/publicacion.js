let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PublicacionSchema = Schema({
  titulo: { type: String, required: true },
  contenido: String,
  multimedia_url: [String],
  tipo: { type: String, default: 'capacitacion' },
  fecha_publicacion: { type: Date, default: Date.now },
  visibilidad_publica: { type: Boolean, default: true },

  id_semillero_organizador: { type: Schema.Types.ObjectId, ref: 'Semillero', required: true },

  detalles_capacitacion: {
    tematica: String,
    instructor: String,
    fecha_hora_inicio: Date,
    fecha_hora_fin: Date,
    enlace_reunion_lugar: String,
    cupo_maximo: Number,
    inscritos: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }]
  }
}, { timestamps: true })

module.exports = mongoose.model('Publicacion', PublicacionSchema, 'publicaciones_semilleros')