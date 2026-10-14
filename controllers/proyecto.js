let Proyecto = require('../models/proyecto')
let Usuario = require('../models/usuario')

const controller = {
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