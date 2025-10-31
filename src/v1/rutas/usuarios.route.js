import express from 'express'

import UsuariosControlador from '../../controllers/usuarios.controlador.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'
import {
  actualizarUsuarioValidaciones,
  crearUsuariosValidaciones
} from '../../middlewares/validaciones/usuarios-campos-post.js'

const usuariosControlador = new UsuariosControlador()

const router = express.Router()

router.get(
  '/',
  rolesPermitidos('admin'),
  usuariosControlador.buscarTodos
)

router.get(
  '/clientes',
  rolesPermitidos('admin', 'empleado'),
  usuariosControlador.buscarTodosClientes
)

router.get(
  '/:usuarioId',
  rolesPermitidos('admin'),
  usuariosControlador.buscarPorId
)

router.post(
  '/',
  rolesPermitidos('admin'),
  crearUsuariosValidaciones,
  validarCampos,
  usuariosControlador.crear
)

// router.post("/", usuariosControlador.crear);

router.put(
  '/:usuarioId',
  rolesPermitidos('admin'),
  actualizarUsuarioValidaciones,
  validarCampos,
  usuariosControlador.actualizar
)

router.delete(
  '/:usuarioId',
  rolesPermitidos('admin'),
  usuariosControlador.eliminar
)

export default router
