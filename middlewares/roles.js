// Uso: router.patch('/:id/estado', authMiddleware, soloRoles('administrador'), controlador)
const soloRoles = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.rol)) return next()
  return res.status(403).send({ message: 'No tienes permisos para esta acción' })
}
module.exports = soloRoles
