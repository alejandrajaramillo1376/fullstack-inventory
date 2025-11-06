import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Registro de nuevo usuario
router.post("/register", registerUser);

// Inicio de sesión
router.post("/login", loginUser);

export default router;