export function rolesPermitidos(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' })
    }
    if (!rolesPermitidos.includes(req.user.tipoUsuario)) {
      const mensajeResp =
        rolesPermitidos.length === 1 && rolesPermitidos[0] === 'admin'
          ? 'Solo administradores tienen acceso'
          : 'Acceso no autorizado'
      return res.status(403).json({ mensaje: mensajeResp })
    }
    next()
  }
}
