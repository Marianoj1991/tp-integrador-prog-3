import express from 'express'

import SalonesControlador from '../../controllers/salones.controlador.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'
import {
  actualizarSalonesValidaciones,
  crearSalonesValidaciones
} from '../../middlewares/validaciones/salones.validaciones.js'

const salonesControlador = new SalonesControlador()

const router = express.Router()

router.get(
  '/',
  rolesPermitidos('admin', 'empleado', 'cliente'),
  salonesControlador.buscarTodos
)

router.get(
  '/:salonId',
  rolesPermitidos('admin', 'empleado', 'cliente'),
  salonesControlador.buscarPorId
)

router.post(
  '/',
  rolesPermitidos('admin', 'empleado'),
  crearSalonesValidaciones,
  validarCampos,
  salonesControlador.crear
)

// router.post("/", salonesControlador.crear);

router.put(
  '/:salonId',
  rolesPermitidos('admin', 'empleado'),
  actualizarSalonesValidaciones,
  validarCampos,
  salonesControlador.actualizar
)

router.delete(
  '/:salonId',
  rolesPermitidos('admin', 'empleado'),
  salonesControlador.eliminar
)

export default router
