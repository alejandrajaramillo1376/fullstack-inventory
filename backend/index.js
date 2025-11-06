import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import itemsRouter from "./routes/items.js";
import authRoutes from "./routes/authRoutes.js";
import "./services/reportService.js";

// Cargar variables de entorno
dotenv.config();

// Crear la app de Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRouter);

// Servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Guardar instancia de socket.io en la app
app.set("io", io);

// Escuchar conexiones de clientes
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);
  socket.on("disconnect", () => console.log("🔴 Cliente desconectado:", socket.id));
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));