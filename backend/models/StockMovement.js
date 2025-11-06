const mongoose = require('mongoose');
const { Schema } = mongoose;

const StockMovementSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  type: { type: String, enum: ['in', 'out', 'adjust'], required: true },
  quantity: { type: Number, required: true },
  reason: String,
  timestamp: { type: Date, default: Date.now },
  user: String
});

module.exports = mongoose.model('StockMovement', StockMovementSchema);