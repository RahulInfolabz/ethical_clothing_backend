const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateItem(req, res) {
  try {
    const { id, category_id, name, description, price, status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid item ID is required" });
    const db = await connectDB();
    const updateFields = { updated_at: new Date() };
    if (category_id && ObjectId.isValid(category_id)) updateFields.category_id = new ObjectId(category_id);
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (price) updateFields.price = parseInt(price);
    if (status) updateFields.status = status;
    if (req.file) updateFields.image = `/uploads/items/${req.file.filename}`;
    const result = await db.collection("clothing_items").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, message: "Item updated successfully" });
  } catch (error) {
    console.error("UpdateItem.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { UpdateItem };
