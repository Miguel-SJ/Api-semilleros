let Publicacion = require('../models/publicacion')

const controller = {
  publicarEvento: function (req, res) {
    let publicacion = new Publicacion()
    const { titulo, contenido, tipo, id_semillero_organizador, detalles_capacitacion } = req.body

    if (titulo && id_semillero_organizador && detalles_capacitacion) {
      publicacion.titulo = titulo
      publicacion.contenido = contenido
      publicacion.tipo = tipo || 'capacitacion'
      publicacion.id_semillero_organizador = id_semillero_organizador
      
      publicacion.detalles_capacitacion = detalles_capacitacion
      publicacion.detalles_capacitacion.inscritos = []

      publicacion.save()
        .then(stored => {
          if (!stored) return res.status(400).send({ message: "No se pudo publicar la capacitación" })
          return res.status(201).json(stored)
        })
        .catch(err => res.status(500).send({ message: `Error al publicar: ${err}` }))
    } else {
      return res.status(400).send({ message: "titulo, id_semillero_organizador y detalles_capacitacion son obligatorios" })
    }
  },

  inscribirEstudiante: function (req, res) {
    let publicacionId = req.params.id
    const { id_usuario } = req.body

    if (!id_usuario) {
      return res.status(400).send({ message: "El id_usuario es obligatorio" })
    }

    Publicacion.findById(publicacionId)
      .then(pub => {
        if (!pub) return res.status(404).send({ message: "Evento o capacitación no encontrada" })

        let inscritos = pub.detalles_capacitacion.inscritos || []
        let cupoMaximo = pub.detalles_capacitacion.cupo_maximo

        if (inscritos.some(id => id.toString() === id_usuario)) {
          return res.status(400).send({ message: "El estudiante ya se encuentra inscrito en este evento" })
        }

        if (cupoMaximo && inscritos.length >= cupoMaximo) {
          return res.status(409).send({ message: "Cupo máximo alcanzado para esta capacitación" })
        }

        pub.detalles_capacitacion.inscritos.push(id_usuario)
        return pub.save()
      })
      .then(updatedPub => {
        if (!updatedPub) return
        return res.status(200).json({
          message: "Inscripción realizada exitosamente",
          publicacion: updatedPub
        })
      })
      .catch(err => res.status(500).send({ message: `Error procesando la inscripción: ${err}` }))
  }
}

module.exports = controller