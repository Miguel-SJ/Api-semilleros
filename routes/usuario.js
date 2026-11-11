const { Router } = require('express')
const UsuarioController = require('../controllers/usuario')

const router = Router()

router.post('/estudiante', UsuarioController.registrarEstudiante)
router.post('/docente', UsuarioController.registrarDocente)
router.get('/', UsuarioController.listar)
router.get('/detalles', UsuarioController.listar)
router.post('/login', UsuarioController.login)

module.exports = router