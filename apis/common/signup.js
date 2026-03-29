const connectDB = require("../../db/dbConnect");

async function Signup(req, res) {
  try {
    const db = await connectDB();
    const userCollection = db.collection("users");

    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExist = await userCollection.findOne({ $or: [{ email }, { phone }] });

    if (userExist) {
      return res.status(400).json({ success: false, message: "Email or phone number already exists" });
    }

    await userCollection.insertOne({
      name,
      email,
      phone,
      password,
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    });

    return res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.error("signup.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { Signup };
