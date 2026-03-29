const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddItem(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { category_id, name, description, price } = req.body;

    if (!category_id || !name || !description || !price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!ObjectId.isValid(category_id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const db = await connectDB();

    const categoryExists = await db.collection("categories").findOne({ _id: new ObjectId(category_id) });
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const image = req.file ? `/uploads/items/${req.file.filename}` : "";

    await db.collection("clothing_items").insertOne({
      category_id: new ObjectId(category_id),
      name,
      description,
      image,
      price: parseInt(price),
      status: "Available",
      created_at: new Date(),
    });

    return res.status(201).json({ success: true, message: "Clothing item added successfully" });
  } catch (error) {
    console.error("AddItem.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { AddItem };
