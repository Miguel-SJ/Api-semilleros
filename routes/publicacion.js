const { Router } = require('express')
const PublicacionController = require('../controllers/publicacion')
// 1. Importamos el middleware de autenticación de tu carpeta middlewares
const authMiddleware = require('../middlewares/authMiddleware') 

const router = Router()

// Rutas públicas (cualquiera puede verlas)
router.get('/', PublicacionController.listar)

// Rutas protegidas (solo usuarios con token JWT válido pueden acceder)
// Pasamos 'authMiddleware' justo antes del controlador
router.post('/', authMiddleware, PublicacionController.publicarEvento)
router.put('/:id/inscribir', authMiddleware, PublicacionController.inscribirEstudiante)

module.exports = router