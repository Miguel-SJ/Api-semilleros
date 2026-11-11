let Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const controller = {
  registrarEstudiante: function (req, res) {
    let usuario = new Usuario()
    const { nombre, apellido, correo_institucional, password, telefono, perfil_estudiante } = req.body

    if (nombre && apellido && correo_institucional && password && perfil_estudiante) {
      usuario.nombre = nombre
      usuario.apellido = apellido
      usuario.correo_institucional = correo_institucional
      usuario.password = password
      usuario.telefono = telefono
      usuario.rol = 'estudiante'
      usuario.perfil_estudiante = perfil_estudiante

      usuario.save()
        .then(stored => {
          if (!stored) return res.status(400).send({ message: "No se pudo guardar el estudiante" })
          
          const token = jwt.sign({ id: stored._id, rol: stored.rol }, process.env.JWT_SECRET, { expiresIn: '1d' })
          return res.status(201).json({ usuario: stored, token }) 
        })
        .catch(err => res.status(500).send({ message: `Error al guardar el estudiante: ${err}` }))
    } else {
      return res.status(400).send({ message: "Nombre, apellido, correo, password y perfil_estudiante son obligatorios" })
    }
  },

  registrarDocente: function (req, res) {
    let usuario = new Usuario()
    // <-- NUEVO: Recibimos el password
    const { nombre, apellido, correo_institucional, password, telefono, perfil_docente } = req.body

    if (nombre && apellido && correo_institucional && password && perfil_docente) {
      usuario.nombre = nombre
      usuario.apellido = apellido
      usuario.correo_institucional = correo_institucional
      usuario.password = password // <-- NUEVO
      usuario.telefono = telefono
      usuario.rol = 'docente'
      usuario.perfil_docente = perfil_docente

      usuario.save()
        .then(stored => {
          if (!stored) return res.status(400).send({ message: "No se pudo guardar el docente" })
          
          const token = jwt.sign({ id: stored._id, rol: stored.rol }, process.env.JWT_SECRET, { expiresIn: '1d' })
          return res.status(201).json({ usuario: stored, token })
        })
        .catch(err => res.status(500).send({ message: `Error al guardar el docente: ${err}` }))
    } else {
      return res.status(400).send({ message: "Nombre, apellido, correo, password y perfil_docente son obligatorios" })
    }
  },

  login: async function (req, res) {
    try {
      const { correo_institucional, password } = req.body;
      
      const usuario = await Usuario.findOne({ correo_institucional });
      if (!usuario) return res.status(404).send({ message: 'Usuario no encontrado' });

      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) return res.status(400).send({ message: 'Contraseña incorrecta' });

      const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      return res.status(200).json({ message: 'Login exitoso', token, usuario });
    } catch (error) {
      return res.status(500).send({ message: `Error interno: ${error}` });
    }
  }
}

module.exports = controller