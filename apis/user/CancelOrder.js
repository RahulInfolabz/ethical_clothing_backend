const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function CancelOrder(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { order_id } = req.body;

    if (!order_id || !ObjectId.isValid(order_id)) {
      return res.status(400).json({ success: false, message: "Valid order ID is required" });
    }

    const db = await connectDB();
    const orderCollection = db.collection("rental_orders");
    const inventoryCollection = db.collection("inventory");

    const order = await orderCollection.findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(user.session._id),
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "Returned") {
      return res.status(400).json({ success: false, message: "Returned orders cannot be cancelled" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }

    // Cancel order
    await orderCollection.updateOne(
      { _id: new ObjectId(order_id) },
      { $set: { status: "Cancelled", updated_at: new Date() } }
    );

    // Restore inventory available qty
    await inventoryCollection.updateOne(
      { item_id: order.item_id, size_id: order.size_id },
      { $inc: { available: 1 } }
    );

    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("CancelOrder.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { CancelOrder };
