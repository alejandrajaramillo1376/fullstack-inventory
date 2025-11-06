import express from "express";
import InventoryItem from "../models/InventoryItem.js";
import { authMiddleware, adminOrManager } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Obtener todos los productos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await InventoryItem.find().lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los productos", error: err });
  }
});

// ✅ Crear nuevo producto (solo admin o manager)
router.post("/", authMiddleware, adminOrManager, async (req, res) => {
  try {
    const item = new InventoryItem(req.body);
    await item.save();

    // Emitir actualización en tiempo real
    const io = req.app.get("io");
    io.emit("inventory-updated", item);

    res.json({ message: "Producto creado", item });
  } catch (err) {
    res.status(500).json({ message: "Error al crear el producto", error: err });
  }
});

// ✅ Actualizar producto (solo admin o manager)
router.put("/:id", authMiddleware, adminOrManager, async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Producto no encontrado" });

    // Emitir actualización
    const io = req.app.get("io");
    io.emit("inventory-updated", item);

    res.json({ message: "Producto actualizado", item });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar", error: err });
  }
});

// ✅ Eliminar producto (solo admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Solo los administradores pueden eliminar" });
  }

  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    const io = req.app.get("io");
    io.emit("inventory-updated");
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar", error: err });
  }
});

// ✅ Registrar movimiento de inventario (entrada/salida)
router.post("/move", authMiddleware, async (req, res) => {
  try {
    const { sku, quantity, type } = req.body;

    if (!sku || !quantity || !type) {
      return res.status(400).json({ error: "Faltan datos (sku, quantity, type)" });
    }

    const item = await InventoryItem.findOne({ sku });
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });

    if (type === "entry") {
      item.quantity += quantity;
    } else if (type === "exit") {
      if (item.quantity < quantity) {
        return res.status(400).json({ error: "Cantidad insuficiente en inventario" });
      }
      item.quantity -= quantity;
      item.lastExit = new Date();
    } else {
      return res.status(400).json({ error: "Tipo inválido: usa 'entry' o 'exit'" });
    }

    await item.save();

    // Emitir evento de actualización al frontend
    const io = req.app.get("io");
    io.emit("inventory-updated", item);

    res.json({ message: "Movimiento registrado correctamente", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar movimiento" });
  }
});

export default router;