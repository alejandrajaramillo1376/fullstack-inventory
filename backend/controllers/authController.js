import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// ✅ Registrar usuario
export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    console.log("📩 Body recibido:", req.body);

    if (!username || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario nuevo
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "viewer",
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ✅ Iniciar sesión
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};