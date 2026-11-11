const { Router } = require('express')
const ProyectoController = require('../controllers/proyecto')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.post('/', authMiddleware, ProyectoController.registrarProyecto)

module.exports = router