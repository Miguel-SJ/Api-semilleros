const { Router } = require('express')
const SemilleroController = require('../controllers/semillero')

const router = Router()

router.post('/', SemilleroController.crearSemillero)
router.put('/:id', SemilleroController.editarSemillero)
router.patch('/:id/cambiar-lider', SemilleroController.cambiarLider)
router.get('/detalles', SemilleroController.obtenerDetallesSemilleros)

module.exports = router