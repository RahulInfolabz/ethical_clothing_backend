const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateProfile(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { name, phone } = req.body;
    const db = await connectDB();
    const collection = db.collection("users");

    const updateFields = { updated_at: new Date() };
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (req.file) updateFields.profile_image = `/uploads/profiles/${req.file.filename}`;

    const result = await collection.updateOne(
      { _id: new ObjectId(user.session._id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await collection.findOne({ _id: new ObjectId(user.session._id) });
    req.session.user.session = updatedUser;

    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("UpdateProfile.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateProfile };
