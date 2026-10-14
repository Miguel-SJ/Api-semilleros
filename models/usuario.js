let mongoose = require('mongoose')
let Schema = mongoose.Schema

let UsuarioSchema = Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo_institucional: { type: String, required: true, unique: true },
  telefono: String,
  rol: { 
    type: String, 
    enum: ['estudiante', 'docente', 'administrador', 'coordinador'], 
    required: true 
  },
  estado: { type: Boolean, default: true },

  perfil_estudiante: {
    codigo_estudiantil: String,
    programa_academico: String,
    semestre_actual: Number,
    intereses_investigacion: [String]
  },

  perfil_docente: {
    escalafon: String,
    departamento_facultad: String,
    horarios_asesoria: [{
      dia_semana: String,
      hora_inicio: String,
      hora_fin: String,
      lugar: String
    }]
  }
}, { timestamps: true })

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios')