const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetProfile(req, res) {
  try {
    const db = await connectDB();
    const profile = await db.collection("users").findOne(
      { _id: new ObjectId(req.user._id) },
      { projection: { password: 0 } }
    );
    if (!profile) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, message: "Profile fetched successfully", data: profile });
  } catch (error) {
    console.error("GetProfile.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { GetProfile };
