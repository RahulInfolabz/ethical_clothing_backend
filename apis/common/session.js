async function Session(req, res) {
  try {
    if (req.session.user && req.session.user.isAuth) {
      return res.status(200).json({ success: true, message: "Session active", userData: req.session.user });
    }
    return res.status(401).json({ success: false, message: "No active session" });
  } catch (error) {
    console.error("session.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = Session;
