const connectDB = require("../../db/dbConnect");

async function ChangePassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Email and new password are required" });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { password: newPassword, updated_at: new Date() } }
    );

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { ChangePassword };
