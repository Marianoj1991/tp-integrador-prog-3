import { Router } from "express";
import passport from "passport";

import ShiftsControlador from "../../controllers/turno.controlador.js";
import { validarCampos } from "../../middlewares/validaciones/validar-campos.js";

import {
  actualizarShiftsValidaciones,
  crearShiftsValidaciones,
} from "../../middlewares/validaciones/shifts.campos-post.js";
import { rolesPermitidos } from "../../middlewares/auth/roles-permitidos.js";

const shiftsControlador = new ShiftsControlador();

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       required:
 *         - orden
 *         - hora_desde
 *         - hora_hasta
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del turno
 *         orden:
 *           type: integer
 *           description: Orden del turno (ej. 1, 2, 3)
 *         hora_desde:
 *           type: string
 *           format: time
 *           description: Hora de inicio del turno
 *         hora_hasta:
 *           type: string
 *           format: time
 *           description: Hora de finalización del turno
 *       example:
 *         id: 1
 *         orden: 1
 *         hora_desde: "18:00"
 *         hora_hasta: "20:00"
 */

/**
 * @swagger
 * /api/turnos:
 *   get:
 *     summary: Listar todos los turnos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 *
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turno'
 *           example:
 *             orden: 2
 *             hora_desde: "20:00"
 *             hora_hasta: "22:00"
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Error en validaciones o datos incompletos
 */

/**
 * @swagger
 * /api/turnos/{turnoId}:
 *   get:
 *     summary: Obtener un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
 *
 *   put:
 *     summary: Actualizar un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turno'
 *           example:
 *             orden: 3
 *             hora_desde: "22:00"
 *             hora_hasta: "00:00"
 *     responses:
 *       200:
 *         description: Turno actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Error en validaciones
 *       404:
 *         description: Turno no encontrado
 *
 *   delete:
 *     summary: Eliminar un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno eliminado exitosamente
 *       404:
 *         description: Turno no encontrado
 */


router.get("/",rolesPermitidos("admin", 'empleado'), shiftsControlador.buscarTodos);

router.get("/:turnoId",rolesPermitidos("admin", 'empleado'), shiftsControlador.buscarPorId);

router.post(
  "/",
  rolesPermitidos("admin", 'empleado'),
  crearShiftsValidaciones,
  validarCampos,
  shiftsControlador.crear
);

router.put(
  "/:turnoId",
  rolesPermitidos("admin", 'empleado'),
  actualizarShiftsValidaciones,
  validarCampos,
  shiftsControlador.actualizar
);

router.delete(
  "/:turnoId",
  rolesPermitidos("admin", 'empleado'),
  shiftsControlador.eliminar
);

export default router;
