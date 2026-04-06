const connectDB = require("../../db/dbConnect");
async function GetPayments(req, res) {
  try {
    const db = await connectDB();
    const payments = await db.collection("payments").aggregate([
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "rental_orders", localField: "order_id", foreignField: "_id", as: "order" } },
      { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "clothing_items", localField: "order.item_id", foreignField: "_id", as: "item" } },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
      { $sort: { date: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Payments fetched successfully", data: payments });
  } catch (error) {
    console.error("GetPayments.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetPayments };
