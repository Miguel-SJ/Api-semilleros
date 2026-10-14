const { Router } = require('express')
const PublicacionController = require('../controllers/publicacion')

const router = Router()

router.post('/', PublicacionController.publicarEvento)
router.put('/:id/inscribir', PublicacionController.inscribirEstudiante)

module.exports = router