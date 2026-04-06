const connectDB = require("../../db/dbConnect");
async function AddCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });
    const db = await connectDB();
    const category = req.file ? `/uploads/categories/${req.file.filename}` : "";
    await db.collection("categories").insertOne({ name, category, status: "Active", created_at: new Date() });
    return res.status(201).json({ success: true, message: "Category added successfully" });
  } catch (error) {
    console.error("AddCategory.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { AddCategory };
