import express from "express";
import AuthControlador from "../../controllers/auth.controlador.js";
import { crearUsuariosValidaciones } from "../../middlewares/validaciones/usuarios-campos-post.js";
import { validarCampos } from "../../middlewares/validaciones/validar-campos.js";

const router = express.Router();
const authControlador = new AuthControlador();

router.post('/login', authControlador.login);

router.post('/signup', crearUsuariosValidaciones,
  validarCampos, authControlador.signUp);

export default router 
