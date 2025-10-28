import express from 'express'

import UsuariosControlador from '../../controllers/usuarios.controlador.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'
import {
  actualizarUsuarioValidaciones,
  crearUsuariosValidaciones
} from '../../middlewares/validaciones/usuarios-campos-post.js'
import { validarJWT } from '../../middlewares/auth/validarJWT.js'

const usuariosControlador = new UsuariosControlador()

const router = express.Router()

router.get(
  '/',
  validarJWT,
  rolesPermitidos('admin'),
  usuariosControlador.buscarTodos
)

router.get(
  '/clientes',
  validarJWT,
  rolesPermitidos('admin', 'empleado'),
  usuariosControlador.buscarTodosClientes
)

router.get(
  '/:usuarioId',
  validarJWT,
  rolesPermitidos('admin'),
  usuariosControlador.buscarPorId
)

router.post(
  '/',
  validarJWT,
  rolesPermitidos('admin'),
  crearUsuariosValidaciones,
  validarCampos,
  usuariosControlador.crear
)

// router.post("/", usuariosControlador.crear);

router.put(
  '/:usuarioId',
  validarJWT,
  rolesPermitidos('admin'),
  actualizarUsuarioValidaciones,
  validarCampos,
  usuariosControlador.actualizar
)

router.delete(
  '/:usuarioId',
  validarJWT,
  rolesPermitidos('admin'),
  usuariosControlador.eliminar
)

export default router
