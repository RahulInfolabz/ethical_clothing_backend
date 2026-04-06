const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbConnect");
const authMiddleware = require("./middleware/auth");
require("dotenv").config();

// ── Multer Instances ──────────────────────────────────────────────────────────
const { categoryUpload, itemUpload, profileUpload } = require("./multer/multer");

// ── Common APIs ───────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public APIs ───────────────────────────────────────────────────────────────
const { GetCategories } = require("./apis/user/GetCategories");
const { GetItems } = require("./apis/user/GetItems");
const { GetItemDetails } = require("./apis/user/GetItemDetails");
const { GetSizes } = require("./apis/user/GetSizes");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User APIs ─────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { PlaceOrder } = require("./apis/user/PlaceOrder");
const { MyOrders } = require("./apis/user/MyOrders");
const { CancelOrder } = require("./apis/user/CancelOrder");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

// ── Admin APIs ────────────────────────────────────────────────────────────────
const { GetUsers } = require("./apis/admin/GetUsers");
const { UpdateUserStatus } = require("./apis/admin/UpdateUserStatus");
const { AddCategory } = require("./apis/admin/AddCategory");
const { UpdateCategory } = require("./apis/admin/UpdateCategory");
const { DeleteCategory } = require("./apis/admin/DeleteCategory");
const { GetAdminCategories } = require("./apis/admin/GetCategories");
const { AddItem } = require("./apis/admin/AddItem");
const { UpdateItem } = require("./apis/admin/UpdateItem");
const { DeleteItem } = require("./apis/admin/DeleteItem");
const { GetAdminItems } = require("./apis/admin/GetItems");
const { AddInventory } = require("./apis/admin/AddInventory");
const { UpdateInventory } = require("./apis/admin/UpdateInventory");
const { DeleteInventory } = require("./apis/admin/DeleteInventory");
const { GetInventory } = require("./apis/admin/GetInventory");
const { GetOrders } = require("./apis/admin/GetOrders");
const { UpdateOrderStatus } = require("./apis/admin/UpdateOrderStatus");
const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminFeedbacks } = require("./apis/admin/GetFeedbacks");
const { DashboardStats } = require("./apis/admin/DashboardStats");

// ─────────────────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://your-frontend.onrender.com", // ← replace with your actual frontend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ── Static File Serving ───────────────────────────────────────────────────────
app.use("/uploads/categories", express.static("uploads/categories"));
app.use("/uploads/items", express.static("uploads/items"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

// ── DB Connect ────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────────────────
//  COMMON APIs
// ─────────────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC APIs (no auth required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/categories", GetCategories);
app.get("/items", GetItems);
app.get("/items/:id", GetItemDetails);
app.get("/sizes", GetSizes);
app.get("/feedbacks", GetFeedbacks);

// ─────────────────────────────────────────────────────────────────────────────
//  USER APIs (JWT required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/user/profile", authMiddleware, GetProfile);
app.post("/user/updateProfile", authMiddleware, profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/placeOrder", authMiddleware, PlaceOrder);
app.get("/user/myOrders", authMiddleware, MyOrders);
app.post("/user/cancelOrder", authMiddleware, CancelOrder);
app.post("/user/genOrderId", authMiddleware, GenOrderId);
app.post("/user/verifyPayment", authMiddleware, VerifyPayment);
app.post("/user/addFeedback", authMiddleware, AddFeedback);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN APIs (JWT required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/admin/users", authMiddleware, GetUsers);
app.post("/admin/updateUserStatus", authMiddleware, UpdateUserStatus);
app.post("/admin/addCategory", authMiddleware, categoryUpload.single("category"), AddCategory);
app.post("/admin/updateCategory", authMiddleware, categoryUpload.single("category"), UpdateCategory);
app.get("/admin/deleteCategory/:id", authMiddleware, DeleteCategory);
app.get("/admin/categories", authMiddleware, GetAdminCategories);
app.post("/admin/addItem", authMiddleware, itemUpload.single("image"), AddItem);
app.post("/admin/updateItem", authMiddleware, itemUpload.single("image"), UpdateItem);
app.get("/admin/deleteItem/:id", authMiddleware, DeleteItem);
app.get("/admin/items", authMiddleware, GetAdminItems);
app.post("/admin/addInventory", authMiddleware, AddInventory);
app.post("/admin/updateInventory", authMiddleware, UpdateInventory);
app.get("/admin/deleteInventory/:id", authMiddleware, DeleteInventory);
app.get("/admin/inventory", authMiddleware, GetInventory);
app.get("/admin/orders", authMiddleware, GetOrders);
app.post("/admin/updateOrderStatus", authMiddleware, UpdateOrderStatus);
app.get("/admin/payments", authMiddleware, GetPayments);
app.get("/admin/feedbacks", authMiddleware, GetAdminFeedbacks);
app.get("/admin/dashboardStats", authMiddleware, DashboardStats);

app.get("/", (req, res) => {
  res.send("Welcome to Clothing Service Platform API!");
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Ethnic Clothing Rental server started on PORT ${PORT}!`)
);
