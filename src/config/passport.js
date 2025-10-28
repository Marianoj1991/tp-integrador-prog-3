import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import UsuariosServicios from '../services/usuarios.servicios.js'
import bcryptjs from 'bcryptjs'

process.loadEnvFile()

const estrategia = new LocalStrategy(
  {
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia'
  },
  async (nombreUsuario, contrasenia, done) => {
    try {
      const usuariosServicios = new UsuariosServicios()
      const usuario = await usuariosServicios.buscarPorNombreUsuario(nombreUsuario)

      const esPassValido = await bcryptjs.compare(contrasenia, usuario.contrasenia)

      if (!usuario || !esPassValido) {
        return done(null, false, {
          message: 'Nombre de usuario y/o contraseña incorrectos.'
        })
      } else {
        return done(null, usuario, { message: 'Login correcto!' })
      }
    } catch (exc) {
      done(exc)
    }
  }
)

const validacion = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwtPayload, done) => {
    try {
      const servicio = new UsuariosServicios()
      const usuario = await servicio.buscarPorId(jwtPayload.usuarioId)     

      if (usuario) {
        return done(null, usuario)
      } else {
        return done(null, false, { message: 'Token incorrecto.' })
      }
    } catch (error) {
      return done(error, false, { message: 'Error interno al validar el token' })
    }
  }
)

export { estrategia, validacion }
