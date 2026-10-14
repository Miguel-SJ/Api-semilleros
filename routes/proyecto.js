const { Router } = require('express')
const ProyectoController = require('../controllers/proyecto')

const router = Router()

router.post('/', ProyectoController.registrarProyecto)

module.exports = router