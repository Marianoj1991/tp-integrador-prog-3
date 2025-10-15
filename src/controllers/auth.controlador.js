import jwt from 'jsonwebtoken'
import passport from 'passport'
import UsuariosDTO from '../database/usuariosDTO.js'
process.loadEnvFile()

export default class AuthControlador {

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
    
        const usuarioDTO = new UsuariosDTO(restoUsuario.usuario_id, restoUsuario.nombre, restoUsuario.apellido, restoUsuario.tipo_usuario, restoUsuario.modificado, restoUsuario.activo)

        const token = jwt.sign({...usuarioDTO}, process.env.JWT_SECRET, {
          expiresIn: '1h'
        })

        return res.json({ token })
      })
    })(req, res)
  }

  signUp = async (req, res) => {
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
      const usuarioCreado = await this.usuarios.create(usuario)
      res.status(201).json({ status: 'OK', data: usuarioCreado })
    } catch (error) {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    }
  }
}

