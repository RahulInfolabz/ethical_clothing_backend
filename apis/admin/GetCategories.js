const connectDB = require("../../db/dbConnect");
async function GetAdminCategories(req, res) {
  try {
    const db = await connectDB();
    const categories = await db.collection("categories").find({}).sort({ created_at: -1 }).toArray();
    return res.status(200).json({ success: true, message: "Categories fetched successfully", data: categories });
  } catch (error) {
    console.error("admin/GetCategories.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetAdminCategories };
