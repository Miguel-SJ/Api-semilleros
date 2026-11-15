const { Router } = require('express')
const PublicacionController = require('../controllers/publicacion')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.get('/', PublicacionController.listar)
router.post('/', authMiddleware, PublicacionController.publicarEvento)
router.put('/:id/inscribir', authMiddleware, PublicacionController.inscribirEstudiante)

module.exports = router
