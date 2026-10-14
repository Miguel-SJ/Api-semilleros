const { Router } = require('express')
const ReporteController = require('../controllers/reporte')

const router = Router()

router.get('/carga-docentes', ReporteController.generarReporteCargaDocentes)

module.exports = router