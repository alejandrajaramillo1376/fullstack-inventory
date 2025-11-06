const InventoryItem = require('../models/InventoryItem');
const StockMovement = require('../models/StockMovement');

exports.create = async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 50, q } = req.query;
    const filter = q
      ? { $or: [{ name: new RegExp(q, 'i') }, { sku: new RegExp(q, 'i') }] }
      : {};
    const items = await InventoryItem.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Versión simplificada sin transacción
exports.move = async (req, res) => {
  try {
    const { type, quantity, reason, user } = req.body;
    if (!['in', 'out', 'adjust'].includes(type))
      return res.status(400).json({ error: 'Tipo inválido' });

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0)
      return res.status(400).json({ error: 'Cantidad inválida' });

    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });

    if (type === 'out' && item.quantity < qty)
      return res.status(400).json({ error: 'Stock insuficiente' });

    // Actualizar cantidad
    const delta = type === 'in' ? qty : type === 'out' ? -qty : 0;
    item.quantity += delta;
    if (type === 'in') item.lastEntry = new Date();
    if (type === 'out') item.lastExit = new Date();
    await item.save();

    // Registrar movimiento
    await StockMovement.create({
      item: item._id,
      type,
      quantity: qty,
      reason,
      user,
    });

    // Emitir actualización por Socket.IO
    const io = req.app.get('io');
    if (io)
      io.emit('stock:update', {
        id: item._id,
        sku: item.sku,
        quantity: item.quantity,
      });

    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};