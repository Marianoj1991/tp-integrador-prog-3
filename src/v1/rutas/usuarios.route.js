import express from "express";
import UsuariosControllers from '../../controllers/usuarios.controllers.js';

const usuarioController = new UsuariosControllers();

const router = express.Router();

router.get("/", usuarioController.findAll);

router.get("/:usuarioId", usuarioController.findById);

router.post("/", usuarioController.create);

router.put("/:usuarioId", usuarioController.update);

router.delete("/:usuarioId", usuarioController.destroy);

export default router;