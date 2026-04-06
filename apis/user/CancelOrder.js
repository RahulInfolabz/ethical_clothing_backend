const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function CancelOrder(req, res) {
  try {
    const { order_id } = req.body;
    if (!order_id || !ObjectId.isValid(order_id)) return res.status(400).json({ success: false, message: "Valid order ID is required" });

    const db = await connectDB();
    const order = await db.collection("rental_orders").findOne({ _id: new ObjectId(order_id), user_id: new ObjectId(req.user._id) });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status === "Returned") return res.status(400).json({ success: false, message: "Returned orders cannot be cancelled" });
    if (order.status === "Cancelled") return res.status(400).json({ success: false, message: "Order is already cancelled" });

    await db.collection("rental_orders").updateOne({ _id: new ObjectId(order_id) }, { $set: { status: "Cancelled", updated_at: new Date() } });
    await db.collection("inventory").updateOne({ item_id: order.item_id, size_id: order.size_id }, { $inc: { available: 1 } });

    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("CancelOrder.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { CancelOrder };
