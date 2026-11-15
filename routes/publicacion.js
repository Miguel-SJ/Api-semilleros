const { Router } = require('express')
const PublicacionController = require('../controllers/publicacion')
const authMiddleware = require('../middlewares/authMiddleware')
const soloRoles = require('../middlewares/roles')

const router = Router()

router.get('/', authMiddleware, PublicacionController.listar)
router.post('/', authMiddleware, soloRoles('docente', 'coordinador', 'administrador'), PublicacionController.publicarEvento)
router.put('/:id/inscribir', authMiddleware, PublicacionController.inscribirEstudiante)
router.delete('/:id/inscribir', authMiddleware, PublicacionController.desinscribir)
router.patch('/:id/estado', authMiddleware, soloRoles('docente', 'coordinador', 'administrador'), PublicacionController.cambiarEstado)
router.delete('/:id', authMiddleware, soloRoles('docente', 'coordinador', 'administrador'), PublicacionController.eliminar)

module.exports = router
