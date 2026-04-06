const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function UpdateOrderStatus(req, res) {
  try {
    const { id, status } = req.body;
    if (!id || !ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Valid order ID is required" });
    const validStatuses = ["Rented", "Returned", "Late", "Cancelled"];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` });
    const db = await connectDB();
    const order = await db.collection("rental_orders").findOne({ _id: new ObjectId(id) });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (status === "Returned" && order.status === "Rented") {
      await db.collection("inventory").updateOne({ item_id: order.item_id, size_id: order.size_id }, { $inc: { available: 1 } });
    }
    await db.collection("rental_orders").updateOne({ _id: new ObjectId(id) }, { $set: { status, updated_at: new Date() } });
    return res.status(200).json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("UpdateOrderStatus.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { UpdateOrderStatus };
