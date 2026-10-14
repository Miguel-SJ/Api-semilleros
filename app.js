const express = require('express')
const usuarios_routes = require('./routes/usuario')
const semilleros_routes = require('./routes/semillero')
const proyectos_routes = require('./routes/proyecto')
const publicaciones_routes = require('./routes/publicacion')
const reportes_routes = require('./routes/reporte')

const app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/usuarios', usuarios_routes)
app.use('/api/semilleros', semilleros_routes)
app.use('/api/proyectos', proyectos_routes)
app.use('/api/publicaciones', publicaciones_routes)
app.use('/api/reportes', reportes_routes)

module.exports = app