const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function DeleteInventory(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid inventory ID" });
    }

    const db = await connectDB();
    const result = await db.collection("inventory").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Inventory entry not found" });
    }

    return res.status(200).json({ success: true, message: "Inventory entry deleted successfully" });
  } catch (error) {
    console.error("DeleteInventory.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { DeleteInventory };
