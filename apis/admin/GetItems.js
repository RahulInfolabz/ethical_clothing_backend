const connectDB = require("../../db/dbConnect");
async function GetAdminItems(req, res) {
  try {
    const db = await connectDB();
    const items = await db.collection("clothing_items").aggregate([
      { $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Items fetched successfully", data: items });
  } catch (error) {
    console.error("admin/GetItems.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetAdminItems };
