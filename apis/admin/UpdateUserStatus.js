const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateUserStatus(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { user_id, status } = req.body;

    if (!user_id || !status) {
      return res.status(400).json({ success: false, message: "User ID and status are required" });
    }

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Active or Inactive" });
    }

    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const db = await connectDB();
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(user_id) }, { $set: { status, updated_at: new Date() } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: `User ${status === "Active" ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("UpdateUserStatus.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateUserStatus };
