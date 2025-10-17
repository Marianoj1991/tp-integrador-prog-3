import express from 'express'
import passport from 'passport'

import ServiciosControlador from '../../controllers/servicios.controlador.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'
import { actualizarServiciosValidaciones, crearServiciosValidaciones } from '../../middlewares/validaciones/servicios-campos-post.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'

const serviciosControlador = new ServiciosControlador()

const router = express.Router()

router.get('/', serviciosControlador.buscarTodos)

router.get('/:servicioId', serviciosControlador.buscarPorId)

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
  crearServiciosValidaciones,
  validarCampos,
  serviciosControlador.crear
)

// router.post("/", serviciosControlador.crear);

router.put(
  '/:servicioId',
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
  actualizarServiciosValidaciones,
  validarCampos,
  serviciosControlador.actualizar
)

router.delete('/:servicioId', serviciosControlador.eliminar)

export default router
