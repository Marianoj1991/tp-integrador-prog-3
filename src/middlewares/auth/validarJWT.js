import passport from 'passport'

export const validarJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error interno al validar el token' })
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || 'Token no autorizado' })
    }

    req.user = user
    next()
  })(req, res, next)
}
