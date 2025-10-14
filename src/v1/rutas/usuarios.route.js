import express from 'express'

import passport from 'passport'

import UsuariosControlador from '../../controllers/usuarios.controlador.js'
import { rolesPermitidos } from '../../middlewares/roles-permitidos.js'

const usuariosControlador = new UsuariosControlador()

const router = express.Router()

router.get('/', usuariosControlador.buscarTodos)

router.get('/:usuarioId', usuariosControlador.buscarPorId)

router.post(
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
  usuariosControlador.crear
)

// router.post("/", usuariosControlador.crear);

router.put('/:usuarioId', usuariosControlador.actualizar)

router.delete('/:usuarioId', usuariosControlador.eliminar)

export default router
