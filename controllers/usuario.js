let Usuario = require('../models/usuario')

const controller = {
  registrarEstudiante: function (req, res) {
    let usuario = new Usuario()
    const { nombre, apellido, correo_institucional, telefono, perfil_estudiante } = req.body

    if (nombre && apellido && correo_institucional && perfil_estudiante) {
      usuario.nombre = nombre
      usuario.apellido = apellido
      usuario.correo_institucional = correo_institucional
      usuario.telefono = telefono
      usuario.rol = 'estudiante'
      usuario.perfil_estudiante = perfil_estudiante

      usuario.save()
        .then(stored => {
          if (!stored) return res.status(400).send({ message: "No se pudo guardar el estudiante" })
          return res.status(201).json(stored)
        })
        .catch(err => res.status(500).send({ message: `Error al guardar el estudiante: ${err}` }))
    } else {
      return res.status(400).send({ message: "Nombre, apellido, correo y perfil_estudiante son obligatorios" })
    }
  },

  registrarDocente: function (req, res) {
    let usuario = new Usuario()
    const { nombre, apellido, correo_institucional, telefono, perfil_docente } = req.body

    if (nombre && apellido && correo_institucional && perfil_docente) {
      usuario.nombre = nombre
      usuario.apellido = apellido
      usuario.correo_institucional = correo_institucional
      usuario.telefono = telefono
      usuario.rol = 'docente'
      usuario.perfil_docente = perfil_docente

      usuario.save()
        .then(stored => {
          if (!stored) return res.status(400).send({ message: "No se pudo guardar el docente" })
          return res.status(201).json(stored)
        })
        .catch(err => res.status(500).send({ message: `Error al guardar el docente: ${err}` }))
    } else {
      return res.status(400).send({ message: "Nombre, apellido, correo y perfil_docente son obligatorios" })
    }
  }
}

module.exports = controller