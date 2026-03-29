const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetItemDetails(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid item ID" });
    }

    const db = await connectDB();

    const itemDetails = await db
      .collection("clothing_items")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    if (!itemDetails.length) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Get inventory with size details
    const inventory = await db
      .collection("inventory")
      .aggregate([
        { $match: { item_id: new ObjectId(id) } },
        {
          $lookup: {
            from: "sizes",
            localField: "size_id",
            foreignField: "_id",
            as: "size",
          },
        },
        { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Item details fetched successfully",
      data: { ...itemDetails[0], inventory },
    });
  } catch (error) {
    console.error("GetItemDetails.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetItemDetails };
