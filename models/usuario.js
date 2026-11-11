let mongoose = require('mongoose')
let Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

let UsuarioSchema = Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo_institucional: { type: String, required: true, unique: true },
  password: { type: String },
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

UsuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios')