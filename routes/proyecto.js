const { Router } = require('express')
const ProyectoController = require('../controllers/proyecto')
const authMiddleware = require('../middlewares/authMiddleware')
const soloRoles = require('../middlewares/roles')

const router = Router()

router.get('/', authMiddleware, ProyectoController.listar)
router.post('/', authMiddleware, soloRoles('estudiante', 'administrador', 'coordinador'), ProyectoController.registrarProyecto)
router.patch('/:id/estado', authMiddleware, ProyectoController.cambiarEstado)

module.exports = router
