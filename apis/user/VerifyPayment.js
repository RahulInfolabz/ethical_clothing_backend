const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const connectDB = require("../../db/dbConnect");

async function VerifyPayment(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "All payment fields are required" });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const db = await connectDB();
    const orderCollection = db.collection("rental_orders");
    const paymentCollection = db.collection("payments");

    const order = await orderCollection.findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(user.session._id),
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Split total into deposit (50%) and rent (50%) as per DD
    const deposit_amount = Math.round(order.total_amount * 0.5);
    const rent_amount = order.total_amount - deposit_amount;

    // Save payment — DD fields: order_id, user_id, total_amount, deposit_amount, rent_amount, payment_type, status, date
    await paymentCollection.insertOne({
      order_id: new ObjectId(order_id),
      user_id: new ObjectId(user.session._id),
      total_amount: order.total_amount,
      deposit_amount,
      rent_amount,
      payment_type: "Razorpay",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "Success",
      date: new Date(),
    });

    // Update order payment status
    await orderCollection.updateOne(
      { _id: new ObjectId(order_id) },
      { $set: { payment_status: "Success", updated_at: new Date() } }
    );

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("VerifyPayment.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { VerifyPayment };
