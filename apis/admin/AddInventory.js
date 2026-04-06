const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function AddInventory(req, res) {
  try {
    const { item_id, size_id, quantity, available } = req.body;
    if (!item_id || !size_id || !quantity || available === undefined) return res.status(400).json({ success: false, message: "All fields are required" });
    if (!ObjectId.isValid(item_id) || !ObjectId.isValid(size_id)) return res.status(400).json({ success: false, message: "Invalid ID provided" });
    const db = await connectDB();
    const exists = await db.collection("inventory").findOne({ item_id: new ObjectId(item_id), size_id: new ObjectId(size_id) });
    if (exists) return res.status(400).json({ success: false, message: "Inventory entry already exists for this item and size" });
    await db.collection("inventory").insertOne({ item_id: new ObjectId(item_id), size_id: new ObjectId(size_id), quantity: parseInt(quantity), available: parseInt(available), created_at: new Date() });
    return res.status(201).json({ success: true, message: "Inventory added successfully" });
  } catch (error) {
    console.error("AddInventory.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { AddInventory };
