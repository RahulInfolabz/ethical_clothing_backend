const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function PlaceOrder(req, res) {
  try {
    const { item_id, size_id, rent_date, return_date } = req.body;

    if (!item_id || !size_id || !rent_date || !return_date) return res.status(400).json({ success: false, message: "Item ID, size ID, rent date and return date are required" });
    if (!ObjectId.isValid(item_id) || !ObjectId.isValid(size_id)) return res.status(400).json({ success: false, message: "Invalid ID provided" });

    const db = await connectDB();
    const item = await db.collection("clothing_items").findOne({ _id: new ObjectId(item_id), status: "Available" });
    if (!item) return res.status(404).json({ success: false, message: "Item not found or unavailable" });

    const inventoryEntry = await db.collection("inventory").findOne({ item_id: new ObjectId(item_id), size_id: new ObjectId(size_id), available: { $gt: 0 } });
    if (!inventoryEntry) return res.status(400).json({ success: false, message: "Selected size is not available" });

    const rentStart = new Date(rent_date);
    const rentEnd = new Date(return_date);
    const rentalDays = Math.max(1, Math.ceil((rentEnd - rentStart) / (1000 * 60 * 60 * 24)));
    const total_amount = item.price * rentalDays;

    await db.collection("rental_orders").insertOne({
      user_id: new ObjectId(req.user._id),
      item_id: new ObjectId(item_id),
      size_id: new ObjectId(size_id),
      rent_date: rentStart,
      return_date: rentEnd,
      rental_days: rentalDays,
      total_amount,
      status: "Rented",
      payment_status: "Pending",
      created_at: new Date(),
    });

    await db.collection("inventory").updateOne({ _id: inventoryEntry._id }, { $inc: { available: -1 } });

    return res.status(201).json({ success: true, message: "Rental order placed successfully" });
  } catch (error) {
    console.error("PlaceOrder.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { PlaceOrder };
