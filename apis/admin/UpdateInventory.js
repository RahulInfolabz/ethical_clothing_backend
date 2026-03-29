const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateInventory(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id, quantity, available } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Valid inventory ID is required" });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };

    if (quantity !== undefined) updateFields.quantity = parseInt(quantity);
    if (available !== undefined) updateFields.available = parseInt(available);

    const result = await db
      .collection("inventory")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Inventory entry not found" });
    }

    return res.status(200).json({ success: true, message: "Inventory updated successfully" });
  } catch (error) {
    console.error("UpdateInventory.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateInventory };
