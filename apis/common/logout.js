async function Logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ success: false, message: "Logout failed" });
      return res.status(200).json({ success: true, message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("logout.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = Logout;
