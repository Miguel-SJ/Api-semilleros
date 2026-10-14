const { Router } = require('express')
const UsuarioController = require('../controllers/usuario')

const router = Router()

router.post('/estudiantes', UsuarioController.registrarEstudiante)
router.post('/docentes', UsuarioController.registrarDocente)

module.exports = router