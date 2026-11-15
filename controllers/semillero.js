let Semillero = require('../models/semillero')
let Usuario = require('../models/usuario')

const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const escapar = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const POP_LIDER = 'nombre apellido correo_institucional telefono perfil_docente'
const POP_INTEGRANTE = 'nombre apellido correo_institucional perfil_estudiante.codigo_estudiantil perfil_estudiante.programa_academico'
const ROLES_GESTION = ['administrador', 'coordinador']

const controller = {
  crearSemillero: function (req, res) {
    const { nombre, facultad, id_docente_lider, area_estudiada, lineas_investigacion } = req.body

    if (!(nombre && facultad && id_docente_lider && area_estudiada && lineas_investigacion)) {
      return res.status(400).send({ message: "Campos obligatorios incompletos" })
    }
    let semillero = new Semillero()
    semillero.nombre = nombre
    semillero.facultad = facultad
    semillero.id_docente_lider = id_docente_lider
    semillero.area_estudiada = area_estudiada
    semillero.lineas_investigacion = lineas_investigacion

    semillero.save()
      .then(stored => res.status(201).json(stored))
      .catch(err => res.status(500).send({ message: `Error al guardar: ${err}` }))
  },

  editarSemillero: function (req, res) {
    const update = { ...req.body }
    delete update.integrantes // los integrantes se manejan solo con asociarme/desasociarme
    Semillero.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' })
      .then(updated => {
        if (!updated) return res.status(404).send({ message: "No se encontró el semillero" })
        return res.status(200).json(updated)
      })
      .catch(err => res.status(500).send({ message: `Error al actualizar: ${err}` }))
  },

  cambiarLider: function (req, res) {
    const { nuevo_id_docente_lider } = req.body
    if (!nuevo_id_docente_lider) {
      return res.status(400).send({ message: "El campo nuevo_id_docente_lider es obligatorio" })
    }
    Usuario.findById(nuevo_id_docente_lider)
      .then(docente => {
        if (!docente) { res.status(400).send({ message: "El usuario indicado no existe" }); return null }
        if (docente.rol !== 'docente') { res.status(400).send({ message: "El usuario asignado debe tener el rol de docente" }); return null }
        return Semillero.findByIdAndUpdate(req.params.id, { id_docente_lider: nuevo_id_docente_lider }, { returnDocument: 'after' })
          .then(s => {
            if (!s) return res.status(404).send({ message: "Semillero no encontrado" })
            return res.status(200).json({ message: "Docente líder del semillero actualizado exitosamente", semillero: s })
          })
      })
      .catch(err => res.status(500).send({ message: `Error interno: ${err}` }))
  },

  // GET /detalles?facultad=&area=&linea=&q=   (q busca en semillero, docente líder, líneas, área e integrantes)
  obtenerDetallesSemilleros: function (req, res) {
    const filtro = {}
    const { facultad, area, linea, q } = req.query
    if (facultad) filtro.facultad = new RegExp(escapar(facultad), 'i')
    if (area) filtro['area_estudiada.nombre'] = new RegExp(escapar(area), 'i')
    if (linea) filtro['lineas_investigacion.nombre'] = new RegExp(escapar(linea), 'i')

    Semillero.find(filtro)
      .populate('id_docente_lider', POP_LIDER)
      .populate('integrantes.id_usuario', POP_INTEGRANTE)
      .exec()
      .then(lista => {
        let out = lista
        if (q && q.trim()) {
          const t = norm(q.trim())
          out = lista.filter(s => {
            const l = s.id_docente_lider
            const textos = [
              s.nombre, s.sigla, s.facultad, s.area_estudiada && s.area_estudiada.nombre,
              l && `${l.nombre} ${l.apellido}`,
              ...(s.lineas_investigacion || []).map(x => x.nombre),
              ...(s.integrantes || []).map(i => i.id_usuario && `${i.id_usuario.nombre} ${i.id_usuario.apellido}`)
            ]
            return textos.some(x => norm(x).includes(t))
          })
        }
        return res.status(200).json(out)
      })
      .catch(err => res.status(500).send({ message: `Error en la consulta: ${err}` }))
  },

  obtenerSemillero: function (req, res) {
    Semillero.findById(req.params.id)
      .populate('id_docente_lider', POP_LIDER)
      .populate('integrantes.id_usuario', POP_INTEGRANTE)
      .then(s => {
        if (!s) return res.status(404).send({ message: "Semillero no encontrado" })
        return res.status(200).json(s)
      })
      .catch(err => res.status(500).send({ message: `Error en la consulta: ${err}` }))
  },

  // El estudiante sale del TOKEN (req.user), no del body
  asociarme: function (req, res) {
    if (req.user.rol !== 'estudiante') {
      return res.status(403).send({ message: "Solo los estudiantes pueden asociarse a un semillero" })
    }
    Semillero.findById(req.params.id)
      .then(s => {
        if (!s) { res.status(404).send({ message: "Semillero no encontrado" }); return null }
        if (s.estado === false) { res.status(400).send({ message: "El semillero está inactivo" }); return null }
        if (s.integrantes.some(i => i.id_usuario.toString() === req.user.id)) {
          res.status(400).send({ message: "Ya perteneces a este semillero" }); return null
        }
        s.integrantes.push({ id_usuario: req.user.id })
        return s.save()
      })
      .then(saved => { if (saved) return res.status(200).json({ message: "Te asociaste al semillero", semillero: saved }) })
      .catch(err => res.status(500).send({ message: `Error al asociarse: ${err}` }))
  },

  desasociarme: function (req, res) {
    Semillero.findByIdAndUpdate(req.params.id, { $pull: { integrantes: { id_usuario: req.user.id } } }, { returnDocument: 'after' })
      .then(s => {
        if (!s) return res.status(404).send({ message: "Semillero no encontrado" })
        return res.status(200).json({ message: "Saliste del semillero", semillero: s })
      })
      .catch(err => res.status(500).send({ message: `Error: ${err}` }))
  },

  // PATCH /:id/estado  { estado: true|false }  -> docente líder o administrador/coordinador
  cambiarEstado: function (req, res) {
    const { estado } = req.body
    if (typeof estado !== 'boolean') return res.status(400).send({ message: "estado debe ser true o false" })
    Semillero.findById(req.params.id)
      .then(s => {
        if (!s) { res.status(404).send({ message: "Semillero no encontrado" }); return null }
        const esLider = s.id_docente_lider.toString() === req.user.id
        if (!ROLES_GESTION.includes(req.user.rol) && !esLider) {
          res.status(403).send({ message: "Solo el docente líder o un administrador puede cambiar el estado" }); return null
        }
        s.estado = estado
        return s.save()
      })
      .then(saved => { if (saved) return res.status(200).json(saved) })
      .catch(err => res.status(500).send({ message: `Error: ${err}` }))
  }
}

module.exports = controller
