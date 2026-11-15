const { Router } = require('express')
const ReporteController = require('../controllers/reporte')

const router = Router()

router.get('/carga-docentes', ReporteController.generarReporteCargaDocentes)
router.get('/resumen', ReporteController.resumen)

module.exports = router
