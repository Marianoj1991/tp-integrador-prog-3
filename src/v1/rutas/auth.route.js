import express from 'express'
import AuthControlador from '../../controllers/auth.controlador.js'
import { crearUsuariosValidaciones } from '../../middlewares/validaciones/usuarios-campos-post.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.js'

const router = express.Router()
const authControlador = new AuthControlador()

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - nombreUsuario
 *         - contrasenia
 *       properties:
 *         email:
 *           type: toLocaleString
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       example:
 *         nombreUsuario: usuario@ejemplo.com
 *         contrasenia: "123456789"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIs..."
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', authControlador.login)

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registro de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error en validaciones
 */
router.post(
  '/signup',
  crearUsuariosValidaciones,
  validarCampos,
  authControlador.signUp
)

export default router
