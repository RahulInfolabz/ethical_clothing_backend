const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function MyOrders(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const db = await connectDB();
    const orders = await db
      .collection("rental_orders")
      .aggregate([
        { $match: { user_id: new ObjectId(user.session._id) } },
        {
          $lookup: { from: "clothing_items", localField: "item_id", foreignField: "_id", as: "item" },
        },
        { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
        {
          $lookup: { from: "categories", localField: "item.category_id", foreignField: "_id", as: "category" },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $lookup: { from: "sizes", localField: "size_id", foreignField: "_id", as: "size" },
        },
        { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({ success: true, message: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.error("MyOrders.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { MyOrders };
