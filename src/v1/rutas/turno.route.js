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

router.get("/",rolesPermitidos("admin"), shiftsControlador.buscarTodos);

router.get("/:turnoId",rolesPermitidos("admin"), shiftsControlador.buscarPorId);

router.post(
  "/",
  rolesPermitidos("admin"),
  crearShiftsValidaciones,
  validarCampos,
  shiftsControlador.crear
);

router.put(
  "/:turnoId",
  rolesPermitidos("admin"),
  actualizarShiftsValidaciones,
  validarCampos,
  shiftsControlador.actualizar
);

router.delete(
  "/:turnoId",
  rolesPermitidos("admin"),
  shiftsControlador.eliminar
);

export default router;
