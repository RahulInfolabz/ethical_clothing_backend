const connectDB = require("../../db/dbConnect");

async function GetSizes(req, res) {
  try {
    const db = await connectDB();
    const sizes = await db
      .collection("sizes")
      .find({})
      .sort({ size: 1 })
      .toArray();

    return res.status(200).json({ success: true, message: "Sizes fetched successfully", data: sizes });
  } catch (error) {
    console.error("GetSizes.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetSizes };
