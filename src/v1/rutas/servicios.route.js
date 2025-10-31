import express from 'express'

import ServiciosControlador from '../../controllers/servicios.controlador.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'
import {
  actualizarServiciosValidaciones,
  crearServiciosValidaciones
} from '../../middlewares/validaciones/servicios-campos-post.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'
import { validarJWT } from '../../middlewares/auth/validarJWT.js'

const serviciosControlador = new ServiciosControlador()

const router = express.Router()

router.get(
  '/',
  rolesPermitidos('admin', 'empleado', 'cliente'),
  serviciosControlador.buscarTodos
)

router.get(
  '/:servicioId',
  rolesPermitidos('admin', 'empleado', 'cliente'),
  serviciosControlador.buscarPorId
)

router.post(
  '/',
  rolesPermitidos('admin', 'empleado'),
  crearServiciosValidaciones,
  validarCampos,
  serviciosControlador.crear
)

// router.post("/", serviciosControlador.crear);

router.put(
  '/:servicioId',
  rolesPermitidos('admin', 'empleado'),
  actualizarServiciosValidaciones,
  validarCampos,
  serviciosControlador.actualizar
)

router.delete(
  '/:servicioId',
  rolesPermitidos('admin', 'empleado'),
  serviciosControlador.eliminar
)

export default router
