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

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - nombreUsuario
 *         - contrasenia
 *         - celular
 *       properties:  
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         nombreUsuario:
 *           type: string
 *           description: Nombre de usuario único (correo electrónico)
 *         contrasenia:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *         celular:
 *           type: string
 *           description: Número de celular del usuario
 *       example:
 *         nombre: "Ignacio"
 *         apellido: "Arancibia"
 *         nombreUsuario: "ignacio@gmail.com"
 *         contrasenia: "123456789"
 *         celular: "2614562389"
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           example:
 *             nombre: "Ignacio"
 *             apellido: "Arancibia"
 *             nombreUsuario: "ignacio@gmail.com"
 *             contrasenia: "123456789"
 *             celular: "2614562389"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error en validaciones o datos incompletos
 */

/**
 * @swagger
 * /api/usuarios/clientes:
 *   get:
 *     summary: Listar todos los usuarios clientes
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */

/**
 * @swagger
 * /api/usuarios/{usuarioId}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           example:
 *             nombre: "Ignacio"
 *             apellido: "Arancibia"
 *             nombreUsuario: "ignacio@gmail.com"
 *             contrasenia: "123456789"
 *             celular: "2614562389"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error en validaciones
 *       404:
 *         description: Usuario no encontrado
 *
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */


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
