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
      console.log("--- PAYLOAD JWT RECIBIDO ---");
      console.log(jwtPayload); // 👈 LINEA DE DEPURACIÓN CLAVE
      console.log("----------------------------");

      const service = new UsuariosServicios()
      
      // Verifica si la propiedad es 'usuarioId' o si es otra (ej: 'id', 'sub', 'uid')
      const idAUsar = jwtPayload.usuarioId; // Podría ser otra propiedad

      if (!idAUsar) {
        // Si no hay ID, falla antes de llamar a la DB
        return done(null, false, { message: 'Token no contiene ID de usuario.' });
      }
      
      const usuario = await service.buscarPorId(idAUsar)
      
      if (usuario) {
        return done(null, usuario)
      } else {
        return done(null, false, { message: 'Usuario no encontrado.' })
      }
    } catch (error) {
      // El error que te está saliendo
      console.error("Error en JwtStrategy:", error); 
      return done(error, false, { message: 'Error interno al validar el token' })
    }
  }
)

export { estrategia, validacion }
