import express from 'express'
import { check } from 'express-validator'
import ReservasControlador from '../../controllers/reservas.controlador.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.validaciones.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'
import { actualizarReservaValidacion, crearReservasValidaciones } from '../../middlewares/validaciones/reservas.validaciones.js'

const reservasControlador = new ReservasControlador()
const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       required:
 *         - fecha_reserva
 *         - salon_id
 *         - usuario_id
 *         - turno_id
 *         - servicios
 *       properties:
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva
 *         salon_id:
 *           type: integer
 *           description: ID del salón reservado
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que realiza la reserva
 *         turno_id:
 *           type: integer
 *           description: ID del turno asociado
 *         foto_cumplieaniero:
 *           type: string
 *           description: URL o nombre de archivo de la foto del cumpleañero
 *         tematica:
 *           type: string
 *           description: Temática de la reserva
 *         importe_salon:
 *           type: number
 *           format: float
 *           description: Importe del salón
 *         importe_total:
 *           type: number
 *           format: float
 *           description: Importe total de la reserva
 *         servicios:
 *           type: array
 *           description: Lista de servicios contratados
 *           items:
 *             type: object
 *             properties:
 *               servicio_id:
 *                 type: integer
 *               importe:
 *                 type: number
 *                 format: float
 *       example:
 *         fecha_reserva: "2025-12-20"
 *         salon_id: 3
 *         usuario_id: 10
 *         turno_id: 3
 *         foto_cumplieaniero: ""
 *         tematica: "Marvel"
 *         importe_salon: 95000
 *         importe_total: 133000
 *         servicios:
 *           - servicio_id: 1
 *             importe: 25000
 *           - servicio_id: 3
 *             importe: 5000
 *           - servicio_id: 7
 *             importe: 8000
 */
/**
 * @swagger
 * /api/reservas/informes:
 *   get:
 *     summary: Obtener informes de reservas
 *     tags: [Reservas]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf, csv]
 *         description: Formato de salida del informe (pdf o csv)
 *     responses:
 *       200:
 *         description: Informe generado correctamente
 */

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Listar todas las reservas
 *     tags: [Reservas]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Error en validaciones o datos incompletos
 */

/**
 * @swagger
 * /api/reservas/{reservaId}:
 *   get:
 *     summary: Obtener una reserva por ID
 *     tags: [Reservas]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Reserva no encontrada
 */

router.get('/informes', reservasControlador.informe)
router.get(
  '/',
  rolesPermitidos('admin', 'empleado'),
  reservasControlador.buscarTodos
)
router.get(
  '/:reservaId',
  rolesPermitidos('admin'),
  reservasControlador.buscarPorId
)
router.post(
  '/',
  rolesPermitidos('admin'),
  crearReservasValidaciones,  
  validarCampos,
  reservasControlador.crear
)
router.put(
  '/',
  rolesPermitidos('admin', 'empleado'),
  actualizarReservaValidacion,  
  validarCampos,
  reservasControlador.crear
)

export default router
