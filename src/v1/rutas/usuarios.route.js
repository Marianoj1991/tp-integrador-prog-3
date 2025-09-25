import express from "express";
import UsuariosControllers from '../../controllers/usuarios.controllers.js';

const usuarioController = new UsuariosControllers();

const router = express.Router();

router.get("/usuarios", usuarioController.findAll);

router.get("/usuarios/:usuarioId", usuarioController.findById);

router.post("/usuarios", usuarioController.create);

router.put("/usuarios/:usuarioId", usuarioController.update);

router.delete("/usuarios/:usuarioId", usuarioController.destroy);

export { router };