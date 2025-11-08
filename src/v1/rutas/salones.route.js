import express from 'express'

import SalonesControlador from '../../controllers/salones.controlador.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.validaciones.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'
import {
  actualizarSalonesValidaciones,
  crearSalonesValidaciones
} from '../../middlewares/validaciones/salones.validaciones.js'

const salonesControlador = new SalonesControlador()

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       required:
 *         - titulo
 *         - direccion
 *         - capacidad
 *         - importe
 *       properties:
 *         titulo:
 *           type: string
 *           description: Nombre o título del salón
 *         direccion:
 *           type: string
 *           description: Dirección del salón
 *         capacidad:
 *           type: integer
 *           description: Capacidad máxima de personas
 *         importe:
 *           type: integer
 *           description: Importe base del salón
 *       example:
 *         titulo: "Salón Principal"
 *         direccion: "Av. San Martín 1234"
 *         capacidad: 200
 *         importe: 95000
 */

/**
 * @swagger
 * /api/salones:
 *   get:
 *     summary: Listar todos los salones
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salones disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salon'
 *
 *   post:
 *     summary: Crear un nuevo salón
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Salon'
 *     responses:
 *       201:
 *         description: Salón creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       400:
 *         description: Error en validaciones o datos incompletos
 */

/**
 * @swagger
 * /api/salones/{salonId}:
 *   get:
 *     summary: Obtener un salón por ID
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Salón encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       404:
 *         description: Salón no encontrado
 *
 *   put:
 *     summary: Actualizar un salón por ID
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Salon'
 *     responses:
 *       200:
 *         description: Salón actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       400:
 *         description: Error en validaciones
 *       404:
 *         description: Salón no encontrado
 *
 *   delete:
 *     summary: Eliminar un salón por ID
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón
 *     responses:
 *       200:
 *         description: Salón eliminado exitosamente
 *       404:
 *         description: Salón no encontrado
 */

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
