let Proyecto = require('../models/proyecto')
let Semillero = require('../models/semillero')
let Publicacion = require('../models/publicacion')
let Usuario = require('../models/usuario')

// Rango de fechas opcional: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD  (hora de Colombia)
function rango(q) {
  const r = {}
  if (q.desde) r.$gte = new Date(`${q.desde}T00:00:00-05:00`)
  if (q.hasta) r.$lte = new Date(`${q.hasta}T23:59:59-05:00`)
  return Object.keys(r).length ? r : null
}

const controller = {
  // Carga de docentes = proyectos asesorados (filtrable por fecha_inicio del proyecto)
  generarReporteCargaDocentes: function (req, res) {
    const f = rango(req.query)
    const pipeline = []
    if (f) pipeline.push({ $match: { fecha_inicio: f } })
    pipeline.push(
      { $group: { _id: "$id_docente_asesor", total_proyectos: { $sum: 1 } } },
      { $lookup: { from: "usuarios", localField: "_id", foreignField: "_id", as: "docente_info" } },
      { $unwind: "$docente_info" },
      { $sort: { total_proyectos: -1 } },
      { $project: {
          _id: 0,
          id_docente: "$_id",
          docente: { $concat: ["$docente_info.nombre", " ", "$docente_info.apellido"] },
          correo: "$docente_info.correo_institucional",
          departamento: "$docente_info.perfil_docente.departamento_facultad",
          total_proyectos: 1
      } }
    )
    Proyecto.aggregate(pipeline)
      .then(reporte => res.status(200).json(reporte))
      .catch(err => res.status(500).send({ message: `Error al generar el reporte: ${err}` }))
  },

  // Resumen general para el dashboard de reportes
  resumen: async function (req, res) {
    try {
      const f = rango(req.query)
      const mp = f ? { fecha_inicio: f } : {}
      const mc = f ? { 'detalles_capacitacion.fecha_hora_inicio': f } : {}
      const ms = f ? { createdAt: f } : {}

      const [semilleros, activos, proyectosPorEstado, eventos, porRol] = await Promise.all([
        Semillero.countDocuments(ms),
        Semillero.countDocuments({ ...ms, estado: true }),
        Proyecto.aggregate([{ $match: mp }, { $group: { _id: "$estado", total: { $sum: 1 } } }, { $sort: { total: -1 } }]),
        Publicacion.find(mc, 'detalles_capacitacion.inscritos detalles_capacitacion.cupo_maximo'),
        Usuario.aggregate([{ $group: { _id: "$rol", total: { $sum: 1 } } }])
      ])
      const inscritos = eventos.reduce((a, e) => a + ((e.detalles_capacitacion.inscritos || []).length), 0)
      return res.status(200).json({
        semilleros: { total: semilleros, activos },
        proyectos: {
          total: proyectosPorEstado.reduce((a, x) => a + x.total, 0),
          por_estado: proyectosPorEstado.map(x => ({ estado: x._id || 'Sin estado', total: x.total }))
        },
        eventos: { total: eventos.length, inscritos },
        usuarios: porRol.map(x => ({ rol: x._id, total: x.total }))
      })
    } catch (err) {
      return res.status(500).send({ message: `Error al generar el resumen: ${err}` })
    }
  }
}

module.exports = controller
