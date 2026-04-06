const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateCategory(req, res) {
  try {
    const { id, name, status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid category ID is required" });
    const db = await connectDB();
    const updateFields = { updated_at: new Date() };
    if (name) updateFields.name = name;
    if (status) updateFields.status = status;
    if (req.file) updateFields.category = `/uploads/categories/${req.file.filename}`;
    const result = await db.collection("categories").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.error("UpdateCategory.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { UpdateCategory };
