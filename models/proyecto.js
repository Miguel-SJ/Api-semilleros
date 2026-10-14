let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ProyectoSchema = Schema({
  titulo: { type: String, required: true },
  descripcion_general: String,
  objetivos: [String],
  fecha_inicio: { type: Date, default: Date.now },
  fecha_finalizacion_estimada: Date,
  estado: { type: String, default: 'En Propuesta' },
  tipo_proyecto: String,

  id_docente_asesor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

  integrantes_participacion: [{
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    rol_en_proyecto: String,
    fecha_vinculacion: { type: Date, default: Date.now },
    participacion: { type: Boolean, default: true }
  }],

  articulacion_interdisciplinar: {
    semilleros_involucrados: [{ type: Schema.Types.ObjectId, ref: 'Semillero' }],
    descripcion_colaboracion: String,
    convenio_acuerdo: String
  }
}, { timestamps: true })

module.exports = mongoose.model('Proyecto', ProyectoSchema, 'proyectos')