function Logout(req, res) {
  return res.status(200).json({ success: true, message: "Logged out successfully" });
}
module.exports = Logout;
