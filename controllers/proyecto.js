let Proyecto = require('../models/proyecto')
let Usuario = require('../models/usuario')

const escapar = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const ESTADOS = ['En Propuesta', 'En ejecucion', 'Finalizado', 'Cancelado']

const controller = {
  // GET /api/proyectos?q=&estado=&desde=YYYY-MM-DD&hasta=YYYY-MM-DD   (fechas sobre fecha_inicio)
  listar: function (req, res) {
    const { q, estado, desde, hasta } = req.query
    const filtro = {}
    if (q) filtro.titulo = new RegExp(escapar(q), 'i')
    if (estado) filtro.estado = new RegExp('^' + escapar(estado) + '$', 'i')
    if (desde || hasta) {
      filtro.fecha_inicio = {}
      if (desde) filtro.fecha_inicio.$gte = new Date(`${desde}T00:00:00-05:00`)
      if (hasta) filtro.fecha_inicio.$lte = new Date(`${hasta}T23:59:59-05:00`)
    }
    Proyecto.find(filtro)
      .populate('id_docente_asesor', 'nombre apellido correo_institucional')
      .populate('integrantes_participacion.id_usuario', 'nombre apellido')
      .populate('articulacion_interdisciplinar.semilleros_involucrados', 'nombre')
      .sort({ fecha_inicio: -1 })
      .then(l => res.status(200).json(l))
      .catch(err => res.status(500).send({ message: `Error al listar proyectos: ${err}` }))
  },

  // PATCH /api/proyectos/:id/estado { estado }  -> docente asesor o administrador/coordinador
  cambiarEstado: function (req, res) {
    const { estado } = req.body
    if (!ESTADOS.includes(estado)) {
      return res.status(400).send({ message: `Estado inválido. Usa: ${ESTADOS.join(', ')}` })
    }
    Proyecto.findById(req.params.id)
      .then(p => {
        if (!p) { res.status(404).send({ message: "Proyecto no encontrado" }); return null }
        const esAsesor = p.id_docente_asesor.toString() === req.user.id
        if (!['administrador', 'coordinador'].includes(req.user.rol) && !esAsesor) {
          res.status(403).send({ message: "Solo el docente asesor o un administrador puede cambiar el estado" }); return null
        }
        p.estado = estado
        return p.save()
      })
      .then(saved => { if (saved) return res.status(200).json(saved) })
      .catch(err => res.status(500).send({ message: `Error: ${err}` }))
  },

  registrarProyecto: function (req, res) {
    let proyecto = new Proyecto()
    const { titulo, descripcion_general, objetivos, id_docente_asesor, integrantes_participacion, tipo_proyecto, articulacion_interdisciplinar } = req.body

    if (!titulo || !id_docente_asesor || !integrantes_participacion) {
      return res.status(400).send({ message: "titulo, id_docente_asesor e integrantes_participacion son obligatorios" })
    }

    let idsIntegrantes = integrantes_participacion.map(i => i.id_usuario)

    Usuario.find({ _id: { $in: idsIntegrantes } })
      .then(usuarios => {
        if (usuarios.length !== idsIntegrantes.length) {
          return res.status(400).send({ message: "Uno o más IDs de integrantes no existen en la base de datos" })
        }

        proyecto.titulo = titulo
        proyecto.descripcion_general = descripcion_general
        proyecto.objetivos = objetivos
        proyecto.id_docente_asesor = id_docente_asesor
        proyecto.integrantes_participacion = integrantes_participacion
        proyecto.tipo_proyecto = tipo_proyecto
        proyecto.articulacion_interdisciplinar = articulacion_interdisciplinar

        return proyecto.save()
      })
      .then(stored => {
        if (!stored) return
        return res.status(201).json(stored)
      })
      .catch(err => res.status(500).send({ message: `Error al guardar proyecto: ${err}` }))
  }
}

module.exports = controller