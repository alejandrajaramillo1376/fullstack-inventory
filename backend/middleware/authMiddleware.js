import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware para verificar el token JWT
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware para verificar roles (admin o manager)
export const adminOrManager = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "manager")) {
    return res.status(403).json({ message: "Access denied: insufficient role" });
  }
  next();
};