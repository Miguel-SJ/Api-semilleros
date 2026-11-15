const { Router } = require('express')
const SemilleroController = require('../controllers/semillero')
const authMiddleware = require('../middlewares/authMiddleware')
const soloRoles = require('../middlewares/roles')

const router = Router()
const gestores = soloRoles('docente', 'coordinador', 'administrador')

router.get('/detalles', SemilleroController.obtenerDetallesSemilleros)
router.get('/:id', SemilleroController.obtenerSemillero)
router.post('/', authMiddleware, gestores, SemilleroController.crearSemillero)
router.put('/:id', authMiddleware, gestores, SemilleroController.editarSemillero)
router.patch('/:id/cambiar-lider', authMiddleware, gestores, SemilleroController.cambiarLider)
router.patch('/:id/estado', authMiddleware, gestores, SemilleroController.cambiarEstado)
router.delete('/:id', authMiddleware, soloRoles('administrador'), SemilleroController.eliminarSemillero)
router.put('/:id/asociarme', authMiddleware, SemilleroController.asociarme)
router.delete('/:id/asociarme', authMiddleware, SemilleroController.desasociarme)

module.exports = router
