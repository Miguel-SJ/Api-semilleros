let Publicacion = require('../models/publicacion')

const controller = {
  listar: function (req, res) {
    Publicacion.find()
      .populate('id_semillero_organizador', 'nombre')
      .sort({ fecha_publicacion: -1 })
      .then(l => res.status(200).json(l))
      .catch(err => res.status(500).send({ message: `Error al listar: ${err}` }))
  },

  publicarEvento: function (req, res) {
    const { titulo, contenido, tipo, id_semillero_organizador, detalles_capacitacion } = req.body

    if (!(titulo && id_semillero_organizador && detalles_capacitacion)) {
      return res.status(400).send({ message: "titulo, id_semillero_organizador y detalles_capacitacion son obligatorios" })
    }

    let publicacion = new Publicacion()
    publicacion.titulo = titulo
    publicacion.contenido = contenido
    publicacion.tipo = tipo || 'capacitacion'
    publicacion.id_semillero_organizador = id_semillero_organizador
    publicacion.detalles_capacitacion = detalles_capacitacion
    publicacion.detalles_capacitacion.inscritos = []

    publicacion.save()
      .then(stored => res.status(201).json(stored))
      .catch(err => res.status(500).send({ message: `Error al publicar: ${err}` }))
  },

  // El usuario sale del TOKEN JWT (lo pone authMiddleware en req.user), no del body
  inscribirEstudiante: function (req, res) {
    const publicacionId = req.params.id
    const id_usuario = req.user && req.user.id

    if (!id_usuario) {
      return res.status(401).send({ message: "Token inválido: no se pudo identificar al usuario" })
    }

    Publicacion.findById(publicacionId)
      .then(pub => {
        if (!pub) {
          res.status(404).send({ message: "Evento o capacitación no encontrada" })
          return null
        }

        const inscritos = pub.detalles_capacitacion.inscritos || []
        const cupoMaximo = pub.detalles_capacitacion.cupo_maximo

        if (inscritos.some(id => id.toString() === id_usuario.toString())) {
          res.status(400).send({ message: "Ya te encuentras inscrito en este evento" })
          return null
        }
        if (cupoMaximo && inscritos.length >= cupoMaximo) {
          res.status(409).send({ message: "Cupo máximo alcanzado para esta capacitación" })
          return null
        }

        pub.detalles_capacitacion.inscritos.push(id_usuario)
        return pub.save()
      })
      .then(updated => {
        if (!updated) return
        return res.status(200).json({ message: "Inscripción realizada exitosamente", publicacion: updated })
      })
      .catch(err => res.status(500).send({ message: `Error procesando la inscripción: ${err}` }))
  }
}

module.exports = controller
