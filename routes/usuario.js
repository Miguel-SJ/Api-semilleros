const { Router } = require('express')
const UsuarioController = require('../controllers/usuario')
const authMiddleware = require('../middlewares/authMiddleware')
const soloRoles = require('../middlewares/roles')

const router = Router()

router.get('/', authMiddleware, UsuarioController.listar)
router.get('/detalles', authMiddleware, UsuarioController.listar)
router.post('/estudiante', UsuarioController.registrarEstudiante)
router.post('/docente', UsuarioController.registrarDocente)
router.post('/login', UsuarioController.login)
router.patch('/:id/estado', authMiddleware, soloRoles('administrador'), UsuarioController.cambiarEstado)

module.exports = router
