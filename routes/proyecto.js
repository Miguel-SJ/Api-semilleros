const { Router } = require('express')
const ProyectoController = require('../controllers/proyecto')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.get('/', authMiddleware, ProyectoController.listar)
router.post('/', authMiddleware, ProyectoController.registrarProyecto)
router.patch('/:id/estado', authMiddleware, ProyectoController.cambiarEstado)

module.exports = router
