const jwt = require("jsonwebtoken");

function Session(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No active session" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, message: "Session active", userData: { session: decoded, isAuth: true } });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
}

module.exports = Session;
