let Semillero = require('../models/semillero')
let Usuario = require('../models/usuario')

const controller = {
crearSemillero: function (req, res) {
    let semillero = new Semillero()
    const { nombre, facultad, id_docente_lider, area_estudiada, lineas_investigacion } = req.body

    if (nombre && facultad && id_docente_lider && area_estudiada && lineas_investigacion) {
      semillero.nombre = nombre
      semillero.facultad = facultad
      semillero.id_docente_lider = id_docente_lider
      semillero.area_estudiada = area_estudiada
      semillero.lineas_investigacion = lineas_investigacion

      semillero.save()
        .then(stored => {
          if (!stored) return res.status(400).send({ message: "No se pudo crear el semillero" })
          return res.status(201).json(stored)
        })
        .catch(err => res.status(500).send({ message: `Error al guardar: ${err}` }))
    } else {
      return res.status(400).send({ message: "Campos obligatorios incompletos" })
    }
  },

  editarSemillero: function (req, res) {
    let semilleroId = req.params.id
    let update = req.body

    Semillero.findByIdAndUpdate(semilleroId, update, { returnDocument: 'after' })
      .then(updated => {
        if (!updated) return res.status(404).send({ message: "No se encontró el semillero" })
        return res.status(200).json(updated)
      })
      .catch(err => res.status(500).send({ message: `Error al actualizar: ${err}` }))
  },

  cambiarLider: function (req, res) {
    let semilleroId = req.params.id
    const { nuevo_id_docente_lider } = req.body

    if (!nuevo_id_docente_lider) {
      return res.status(400).send({ message: "El campo nuevo_id_docente_lider es obligatorio" })
    }

    Usuario.findById(nuevo_id_docente_lider)
      .then(docente => {
        if (!docente) {
          return res.status(400).send({ message: "El usuario indicado no existe" })
        }
        if (docente.rol !== 'docente') {
          return res.status(400).send({ message: "El usuario asignado debe tener el rol de docente" })
        }

        return Semillero.findByIdAndUpdate(
          semilleroId,
          { id_docente_lider: nuevo_id_docente_lider },
          { returnDocument: 'after' }
        )
      })
      .then(semilleroActualizado => {
        if (!semilleroActualizado) {
          return res.status(404).send({ message: "Semillero no encontrado" })
        }
        return res.status(200).json({
          message: "Docente líder del semillero actualizado exitosamente",
          semillero: semilleroActualizado
        })
      })
      .catch(err => res.status(500).send({ message: `Error interno: ${err}` }))
  },

  obtenerDetallesSemilleros: function (req, res) {
    let filtro = {}
    const { facultad, area } = req.query

    if (facultad) filtro.facultad = new RegExp(facultad, 'i')
    if (area) filtro['area_estudiada.nombre'] = new RegExp(area, 'i')

    Semillero.find(filtro)
      .populate('id_docente_lider', 'nombre apellido correo_institucional telefono perfil_docente')
      .exec()
      .then(semilleros => {
        if (!semilleros || semilleros.length === 0) {
          return res.status(404).send({ message: "No se encontraron semilleros" })
        }
        return res.status(200).json(semilleros)
      })
      .catch(err => res.status(500).send({ message: `Error en la consulta: ${err}` }))
  }
}

module.exports = controller