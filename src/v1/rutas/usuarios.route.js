import express from 'express'
import passport from 'passport'

import UsuariosControlador from '../../controllers/usuarios.controlador.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'
import { actualizarUsuarioValidaciones, crearUsuariosValidaciones } from '../../middlewares/validaciones/usuarios-campos-post.js'

const usuariosControlador = new UsuariosControlador()

const router = express.Router()

router.get('/', usuariosControlador.buscarTodos)

router.get('/:usuarioId', usuariosControlador.buscarPorId)

/*router.post(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  (err, req, res, next) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error interno al validar el token' })
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: req.authInfo?.message || 'Token no autorizado' })
    }

    next()
  },
  rolesPermitidos('admin'),
  crearUsuariosValidaciones,
  validarCampos,
  usuariosControlador.crear
)
*/
router.post("/", usuariosControlador.crear);

router.put(
  '/:usuarioId',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  (err, req, res, next) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error interno al validar el token' })
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ message: req.authInfo?.message || 'Token no autorizado' })
    }

    next()
  },
  rolesPermitidos('admin'),
  actualizarUsuarioValidaciones,
  validarCampos,
  usuariosControlador.actualizar
)

router.delete('/:usuarioId', usuariosControlador.eliminar)

export default router
