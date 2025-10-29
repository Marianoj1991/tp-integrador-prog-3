
import passport from 'passport'
import UsuariosDTO from '../database/usuariosDTO.js'
import UsuariosServicios from '../services/usuarios.servicios.js'
import { crearToken } from '../utils/crearToken.js'
process.loadEnvFile()

export default class AuthControlador {
  constructor() {
    this.usuarios = new UsuariosServicios()
  }

  login = async (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info?.message ? info.message : '',
          user
        })
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err)
        }
        const { contrasenia, ...restoUsuario } = user

        const {
          usuario_id,
          nombre,
          apellido,
          nombre_usuario,
          tipo_usuario,
          modificado,
          activo,
          celular,
          foto
        } = restoUsuario
        const dataUsuarioToken = new UsuariosDTO(
          usuario_id,
          nombre,
          apellido,
          nombre_usuario,
          tipo_usuario,
          modificado,
          activo,
          celular,
          foto
        )

        const token = crearToken(dataUsuarioToken)

        return res.json({ token })
      })
    })(req, res)
  }

  signUp = async (req, res) => {

    const { body } = req

    if (
      !body.nombre ||
      !body.apellido ||
      !body.nombreUsuario ||
      !body.contrasenia
    ) {
      res.status(400).json({
        status: 'FAILED',
        data: {
          error:
            "Uno de los siguientes datos falta o es vacío: 'nombre', 'apellido' 'nombre de usuario', 'contrasenia'."
        }
      })
    }
    const usuario = {
      nombre: body.nombre,
      apellido: body.apellido,
      nombreUsuario: body.nombreUsuario,
      contrasenia: body.contrasenia,
      tipoUsuario: 3,
      celular: body.celular ? body.celular : '',
      foto: body.foto ? body.foto : '',
      activo: 1
    }

    try {
      const usuarioCreado = await this.usuarios.crear(usuario)

      const token = crearToken(usuarioCreado)

      res.status(201).json({ status: 'OK', data: usuarioCreado, token })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }
}

