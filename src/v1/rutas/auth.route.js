import express from "express";
import AuthController from "../../controllers/auth.controllers.js";

const router = express.Router();
const authController = new AuthController();
router.post('/login', authController.login);

export default router 
