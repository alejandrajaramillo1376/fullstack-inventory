import mongoose from "mongoose";

const { Schema } = mongoose;

const InventoryItemSchema = new Schema({
  sku: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: String,
  quantity: { type: Number, default: 0 },
  reorderPoint: { type: Number, default: 0 },
  location: String,
  cost: { type: Number, default: 0 },
  supplier: String,
  lastEntry: Date,
  lastExit: Date,
  createdAt: { type: Date, default: Date.now }
});

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);

export default InventoryItem;