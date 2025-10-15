import express from "express";
import AuthControlador from "../../controllers/auth.controlador.js";

const router = express.Router();
const authControlador = new AuthControlador();

router.post('/login', authControlador.login);

router.post('/signup', authControlador.signUp);

export default router 
