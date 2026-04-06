const connectDB = require("../../db/dbConnect");
const jwt = require("jsonwebtoken");

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ email, password });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.status === "Inactive") {
      return res.status(401).json({ success: false, message: "Your account has been deactivated" });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userData: { session: user, isAuth: true },
    });
  } catch (error) {
    console.error("login.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { Login };
