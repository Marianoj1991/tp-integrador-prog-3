import express from 'express'

import ServiciosControlador from '../../controllers/servicios.controlador.js'
import { validarCampos } from '../../middlewares/validaciones/validar-campos.validaciones.js'
import {
  actualizarServiciosValidaciones,
  crearServiciosValidaciones
} from '../../middlewares/validaciones/servicios.validaciones.js'
import { rolesPermitidos } from '../../middlewares/auth/roles-permitidos.js'

const serviciosControlador = new ServiciosControlador()

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       required:
 *         - descripcion
 *         - importe
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del servicio
 *         descripcion:
 *           type: string
 *           description: Descripción del servicio
 *         importe:
 *           type: integer
 *           description: Importe del servicio
 *       example:
 *         id: 1
 *         descripcion: "Mesa Metegol"
 *         importe: 30000
 */

/**
 * @swagger
 * /api/servicios:
 *   get:
 *     summary: Listar todos los servicios
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 *
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       400:
 *         description: Error en validaciones o datos incompletos
 */

/**
 * @swagger
 * /api/servicios/{servicioId}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: Servicio no encontrado
 *
 *   put:
 *     summary: Actualizar un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       400:
 *         description: Error en validaciones
 *       404:
 *         description: Servicio no encontrado
 *
 *   delete:
 *     summary: Eliminar un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */

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
