let Proyecto = require('../models/proyecto')

const controller = {
  generarReporteCargaDocentes: function (req, res) {
    Proyecto.aggregate([
      {
        $group: {
          _id: "$id_docente_asesor",
          total_proyectos: { $sum: 1 } } }, {$lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "docente_info"
        }
      },
      {
        $unwind: "$docente_info"
      },
      {
        $sort: { total_proyectos: -1 } }, {$project: {
          _id: 0,
          id_docente: "$_id",
          docente: { $concat: ["$docente_info.nombre", " ", "$docente_info.apellido"] },
          correo: "$docente_info.correo_institucional",
          departamento: "$docente_info.perfil_docente.departamento_facultad",
          total_proyectos: 1
        }
      }
    ])
    .then(reporte => {
      if (!reporte || reporte.length === 0) {
        return res.status(404).send({ message: "No se encontraron proyectos para generar el reporte" })
      }
      return res.status(200).json(reporte)
    })
    .catch(err => res.status(500).send({ message: `Error al generar el reporte: ${err}` }))
  }
}

module.exports = controller