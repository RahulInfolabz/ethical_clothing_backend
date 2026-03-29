const { ObjectId } = require("mongodb");
const Razorpay = require("razorpay");
const connectDB = require("../../db/dbConnect");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function GenOrderId(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { order_id } = req.body;

    if (!order_id || !ObjectId.isValid(order_id)) {
      return res.status(400).json({ success: false, message: "Valid order ID is required" });
    }

    const db = await connectDB();
    const order = await db.collection("rental_orders").findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(user.session._id),
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.payment_status === "Success") {
      return res.status(400).json({ success: false, message: "Payment already completed for this order" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total_amount * 100), // in paise
      currency: "INR",
      receipt: `receipt_${order_id}`,
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: {
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        rental_order_id: order_id,
      },
    });
  } catch (error) {
    console.error("GenOrderId.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GenOrderId };
