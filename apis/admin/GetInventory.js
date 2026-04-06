const connectDB = require("../../db/dbConnect");
async function GetInventory(req, res) {
  try {
    const db = await connectDB();
    const inventory = await db.collection("inventory").aggregate([
      { $lookup: { from: "clothing_items", localField: "item_id", foreignField: "_id", as: "item" } },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "sizes", localField: "size_id", foreignField: "_id", as: "size" } },
      { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Inventory fetched successfully", data: inventory });
  } catch (error) {
    console.error("GetInventory.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetInventory };
