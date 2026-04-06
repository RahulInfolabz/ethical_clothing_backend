const connectDB = require("../../db/dbConnect");
async function GetUsers(req, res) {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find({ role: "User" }, { projection: { password: 0 } }).sort({ created_at: -1 }).toArray();
    return res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error("GetUsers.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetUsers };
