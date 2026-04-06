const connectDB = require("../../db/dbConnect");
async function GetOrders(req, res) {
  try {
    const db = await connectDB();
    const orders = await db.collection("rental_orders").aggregate([
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "clothing_items", localField: "item_id", foreignField: "_id", as: "item" } },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "sizes", localField: "size_id", foreignField: "_id", as: "size" } },
      { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.error("GetOrders.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetOrders };
