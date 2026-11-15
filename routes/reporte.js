const { Router } = require('express')
const ReporteController = require('../controllers/reporte')
const authMiddleware = require('../middlewares/authMiddleware')
const soloRoles = require('../middlewares/roles')

const router = Router()
const verReportes = soloRoles('docente', "administrador")

router.get('/carga-docentes', authMiddleware, verReportes, ReporteController.generarReporteCargaDocentes)
router.get('/resumen', authMiddleware, verReportes, ReporteController.resumen)

module.exports = router
