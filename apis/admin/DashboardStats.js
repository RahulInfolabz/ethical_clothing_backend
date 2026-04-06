const connectDB = require("../../db/dbConnect");
async function DashboardStats(req, res) {
  try {
    const db = await connectDB();
    const totalUsers = await db.collection("users").countDocuments({ role: "User" });
    const totalCategories = await db.collection("categories").countDocuments({});
    const totalItems = await db.collection("clothing_items").countDocuments({});
    const availableItems = await db.collection("clothing_items").countDocuments({ status: "Available" });
    const rentedItems = await db.collection("clothing_items").countDocuments({ status: "Rented" });
    const totalOrders = await db.collection("rental_orders").countDocuments({});
    const activeRentals = await db.collection("rental_orders").countDocuments({ status: "Rented" });
    const returnedOrders = await db.collection("rental_orders").countDocuments({ status: "Returned" });
    const lateOrders = await db.collection("rental_orders").countDocuments({ status: "Late" });

    const revenueResult = await db.collection("payments").aggregate([{ $match: { status: "Success" } }, { $group: { _id: null, total: { $sum: "$total_amount" } } }]).toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const ratingResult = await db.collection("feedbacks").aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]).toArray();
    const avgRating = ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

    const recentOrders = await db.collection("rental_orders").aggregate([
      { $sort: { created_at: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "clothing_items", localField: "item_id", foreignField: "_id", as: "item" } },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
    ]).toArray();

    const recentPayments = await db.collection("payments").aggregate([
      { $sort: { date: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
    ]).toArray();

    return res.status(200).json({ success: true, message: "Dashboard stats fetched successfully", data: { totalUsers, totalCategories, totalItems, availableItems, rentedItems, totalOrders, activeRentals, returnedOrders, lateOrders, totalRevenue, avgRating, recentOrders, recentPayments } });
  } catch (error) {
    console.error("DashboardStats.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { DashboardStats };
