let Publicacion = require('../models/publicacion')

const GESTORES = ['administrador', 'coordinador']
const ESTADOS = ['Próximo', 'Finalizado', 'Cancelado']

function puedeGestionar(pub, user) {
  if (GESTORES.includes(user.rol)) return true
  if (pub.creado_por && String(pub.creado_por) === user.id) return true
  const sem = pub.id_semillero_organizador
  const lider = sem && sem.id_docente_lider
  return !!lider && String(lider._id || lider) === user.id
}

const cargarConSemillero = (id) => Publicacion.findById(id).populate('id_semillero_organizador', 'nombre id_docente_lider')

const controller = {
  listar: function (req, res) {
    Publicacion.find()
      .populate('id_semillero_organizador', 'nombre id_docente_lider')
      .sort({ fecha_publicacion: -1 })
      .then(l => res.status(200).json(l.map(p => ({ ...p.toJSON(), puede_gestionar: puedeGestionar(p, req.user) }))))
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
    publicacion.creado_por = req.user.id

    publicacion.save()
      .then(stored => res.status(201).json(stored))
      .catch(err => res.status(500).send({ message: `Error al publicar: ${err}` }))
  },

  inscribirEstudiante: function (req, res) {
    const id_usuario = req.user && req.user.id
    if (!id_usuario) return res.status(401).send({ message: "Token inválido: no se pudo identificar al usuario" })

    Publicacion.findById(req.params.id)
      .then(pub => {
        if (!pub) { res.status(404).send({ message: "Evento o capacitación no encontrada" }); return null }
        if (pub.estado && pub.estado !== 'Próximo') {
          res.status(400).send({ message: `Este evento está ${pub.estado.toLowerCase()} y ya no admite inscripciones` }); return null
        }
        const inscritos = pub.detalles_capacitacion.inscritos || []
        const cupoMaximo = pub.detalles_capacitacion.cupo_maximo

        if (inscritos.some(id => id.toString() === id_usuario.toString())) {
          res.status(400).send({ message: "Ya te encuentras inscrito en este evento" }); return null
        }
        if (cupoMaximo && inscritos.length >= cupoMaximo) {
          res.status(409).send({ message: "Cupo máximo alcanzado para esta capacitación" }); return null
        }
        pub.detalles_capacitacion.inscritos.push(id_usuario)
        return pub.save()
      })
      .then(updated => { if (updated) return res.status(200).json({ message: "Inscripción realizada exitosamente", publicacion: updated }) })
      .catch(err => res.status(500).send({ message: `Error procesando la inscripción: ${err}` }))
  },

  desinscribir: function (req, res) {
    Publicacion.findByIdAndUpdate(req.params.id, { $pull: { 'detalles_capacitacion.inscritos': req.user.id } }, { returnDocument: 'after' })
      .then(p => {
        if (!p) return res.status(404).send({ message: "Evento o capacitación no encontrada" })
        return res.status(200).json({ message: "Te desinscribiste del evento", publicacion: p })
      })
      .catch(err => res.status(500).send({ message: `Error: ${err}` }))
  },

  cambiarEstado: function (req, res) {
    const { estado } = req.body
    if (!ESTADOS.includes(estado)) return res.status(400).send({ message: `Estado inválido. Usa: ${ESTADOS.join(', ')}` })
    cargarConSemillero(req.params.id)
      .then(p => {
        if (!p) { res.status(404).send({ message: "Evento no encontrado" }); return null }
        if (!puedeGestionar(p, req.user)) { res.status(403).send({ message: "Solo quien creó el evento, el docente líder del semillero o un administrador puede cambiarlo" }); return null }
        p.estado = estado
        return p.save()
      })
      .then(saved => { if (saved) return res.status(200).json(saved) })
      .catch(err => res.status(500).send({ message: `Error: ${err}` }))
  },

  eliminar: function (req, res) {
    cargarConSemillero(req.params.id)
      .then(p => {
        if (!p) { res.status(404).send({ message: "Evento no encontrado" }); return null }
        if (!puedeGestionar(p, req.user)) { res.status(403).send({ message: "Solo quien creó el evento, el docente líder del semillero o un administrador puede eliminarlo" }); return null }
        return p.deleteOne().then(() => res.status(200).json({ message: "Evento eliminado" }))
      })
      .catch(err => res.status(500).send({ message: `Error: ${err}` }))
  }
}

module.exports = controller
