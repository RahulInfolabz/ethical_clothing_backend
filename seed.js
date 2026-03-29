const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "clothing_rental";

async function seed() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  console.log("🌱 Starting seed...");

  // ── Clear ─────────────────────────────────────────────────────────────────
  await db.collection("users").deleteMany({});
  await db.collection("categories").deleteMany({});
  await db.collection("clothing_items").deleteMany({});
  await db.collection("sizes").deleteMany({});
  await db.collection("inventory").deleteMany({});
  await db.collection("rental_orders").deleteMany({});
  await db.collection("payments").deleteMany({});
  await db.collection("feedbacks").deleteMany({});

  console.log("🗑️  Cleared existing collections");

  // ── Users ─────────────────────────────────────────────────────────────────
  const usersResult = await db.collection("users").insertMany([
    {
      name: "Admin User",
      email: "admin@clothing.com",
      phone: "9900000001",
      password: "Admin@123",
      profile_image: "",
      role: "Admin",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Priya Mehta",
      email: "priya@gmail.com",
      phone: "9900000002",
      password: "Priya@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Riya Shah",
      email: "riya@gmail.com",
      phone: "9900000003",
      password: "Riya@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const userIds = Object.values(usersResult.insertedIds);
  console.log("✅ Users seeded");

  // ── Categories ────────────────────────────────────────────────────────────
  const categoriesResult = await db.collection("categories").insertMany([
    {
      name: "Wedding Wear",
      category: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Festival Wear",
      category: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Party Wear",
      category: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Traditional Casual",
      category: "",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Bridal Collection",
      category: "",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const categoryIds = Object.values(categoriesResult.insertedIds);
  console.log("✅ Categories seeded");

  // ── Sizes ─────────────────────────────────────────────────────────────────
  const sizesResult = await db.collection("sizes").insertMany([
    { size: "XS", created_at: new Date() },
    { size: "S", created_at: new Date() },
    { size: "M", created_at: new Date() },
    { size: "L", created_at: new Date() },
    { size: "XL", created_at: new Date() },
    { size: "XXL", created_at: new Date() },
  ]);

  const sizeIds = Object.values(sizesResult.insertedIds);
  console.log("✅ Sizes seeded");

  // ── Clothing Items ────────────────────────────────────────────────────────
  const itemsResult = await db.collection("clothing_items").insertMany([
    {
      category_id: categoryIds[0], // Wedding Wear
      name: "Designer Bridal Lehenga",
      description: "Heavy embroidered bridal lehenga with intricate zari work, mirror detailing, and dupatta. Perfect for wedding ceremonies.",
      image: "",
      price: 2500,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0], // Wedding Wear
      name: "Sherwani with Accessories",
      description: "Royal blue sherwani with gold embroidery, comes with matching pagdi and brooch. Ideal for groom and groomsmen.",
      image: "",
      price: 2000,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1], // Festival Wear
      name: "Navratri Chaniya Choli",
      description: "Vibrant multi-colored chaniya choli with mirror work and bandhani print. Perfect for Navratri and Garba events.",
      image: "",
      price: 800,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1], // Festival Wear
      name: "Silk Saree with Blouse",
      description: "Pure silk Kanjivaram saree with gold zari border and matching blouse piece. Ideal for festivals and puja ceremonies.",
      image: "",
      price: 1200,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2], // Party Wear
      name: "Anarkali Suit",
      description: "Floor-length Anarkali suit with heavy embroidery, net dupatta, and embellished churidar. Perfect for sangeet and mehendi.",
      image: "",
      price: 1500,
      status: "Rented",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[3], // Traditional Casual
      name: "Cotton Kurti with Palazzo",
      description: "Comfortable cotton kurti with printed palazzo pants. Great for casual ethnic occasions and family functions.",
      image: "",
      price: 500,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[4], // Bridal Collection
      name: "Heavy Bridal Saree",
      description: "Exquisite heavy bridal saree with stone work, golden embroidery, and matching blouse. Complete bridal look.",
      image: "",
      price: 3000,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2], // Party Wear
      name: "Indo-Western Fusion Gown",
      description: "Stylish indo-western gown with cape, perfect for sangeet, cocktail parties, and reception events.",
      image: "",
      price: 1800,
      status: "Available",
      created_at: new Date(),
    },
  ]);

  const itemIds = Object.values(itemsResult.insertedIds);
  console.log("✅ Clothing Items seeded");

  // ── Inventory ─────────────────────────────────────────────────────────────
  await db.collection("inventory").insertMany([
    // Designer Bridal Lehenga
    { item_id: itemIds[0], size_id: sizeIds[2], quantity: 3, available: 3, created_at: new Date() }, // M
    { item_id: itemIds[0], size_id: sizeIds[3], quantity: 2, available: 2, created_at: new Date() }, // L
    { item_id: itemIds[0], size_id: sizeIds[4], quantity: 2, available: 2, created_at: new Date() }, // XL
    // Sherwani
    { item_id: itemIds[1], size_id: sizeIds[2], quantity: 3, available: 3, created_at: new Date() }, // M
    { item_id: itemIds[1], size_id: sizeIds[3], quantity: 3, available: 3, created_at: new Date() }, // L
    { item_id: itemIds[1], size_id: sizeIds[4], quantity: 2, available: 2, created_at: new Date() }, // XL
    // Chaniya Choli
    { item_id: itemIds[2], size_id: sizeIds[1], quantity: 5, available: 5, created_at: new Date() }, // S
    { item_id: itemIds[2], size_id: sizeIds[2], quantity: 5, available: 5, created_at: new Date() }, // M
    { item_id: itemIds[2], size_id: sizeIds[3], quantity: 4, available: 4, created_at: new Date() }, // L
    // Silk Saree
    { item_id: itemIds[3], size_id: sizeIds[2], quantity: 4, available: 4, created_at: new Date() }, // M
    { item_id: itemIds[3], size_id: sizeIds[3], quantity: 4, available: 3, created_at: new Date() }, // L (1 rented)
    // Anarkali Suit
    { item_id: itemIds[4], size_id: sizeIds[2], quantity: 3, available: 2, created_at: new Date() }, // M (1 rented)
    { item_id: itemIds[4], size_id: sizeIds[3], quantity: 3, available: 3, created_at: new Date() }, // L
    // Cotton Kurti
    { item_id: itemIds[5], size_id: sizeIds[1], quantity: 6, available: 6, created_at: new Date() }, // S
    { item_id: itemIds[5], size_id: sizeIds[2], quantity: 6, available: 6, created_at: new Date() }, // M
    { item_id: itemIds[5], size_id: sizeIds[3], quantity: 5, available: 5, created_at: new Date() }, // L
    // Bridal Saree
    { item_id: itemIds[6], size_id: sizeIds[2], quantity: 2, available: 2, created_at: new Date() }, // M
    { item_id: itemIds[6], size_id: sizeIds[3], quantity: 2, available: 2, created_at: new Date() }, // L
    // Indo-Western Gown
    { item_id: itemIds[7], size_id: sizeIds[2], quantity: 3, available: 3, created_at: new Date() }, // M
    { item_id: itemIds[7], size_id: sizeIds[3], quantity: 3, available: 3, created_at: new Date() }, // L
  ]);

  console.log("✅ Inventory seeded");

  // ── Rental Orders ─────────────────────────────────────────────────────────
  const ordersResult = await db.collection("rental_orders").insertMany([
    {
      user_id: userIds[1], // Priya
      item_id: itemIds[4], // Anarkali Suit (Rented)
      size_id: sizeIds[2], // M
      rent_date: new Date("2025-12-10"),
      return_date: new Date("2025-12-14"),
      rental_days: 4,
      total_amount: 6000,
      status: "Rented",
      payment_status: "Success",
      created_at: new Date("2025-12-08"),
    },
    {
      user_id: userIds[2], // Riya
      item_id: itemIds[3], // Silk Saree
      size_id: sizeIds[3], // L
      rent_date: new Date("2025-12-15"),
      return_date: new Date("2025-12-17"),
      rental_days: 2,
      total_amount: 2400,
      status: "Returned",
      payment_status: "Success",
      created_at: new Date("2025-12-13"),
    },
    {
      user_id: userIds[1], // Priya
      item_id: itemIds[2], // Chaniya Choli
      size_id: sizeIds[2], // M
      rent_date: new Date("2026-01-10"),
      return_date: new Date("2026-01-12"),
      rental_days: 2,
      total_amount: 1600,
      status: "Rented",
      payment_status: "Pending",
      created_at: new Date(),
    },
  ]);

  const orderIds = Object.values(ordersResult.insertedIds);
  console.log("✅ Rental Orders seeded");

  // ── Payments ──────────────────────────────────────────────────────────────
  await db.collection("payments").insertMany([
    {
      order_id: orderIds[0],
      user_id: userIds[1],
      total_amount: 6000,
      deposit_amount: 3000,
      rent_amount: 3000,
      payment_type: "Razorpay",
      razorpay_order_id: "order_demo_001",
      razorpay_payment_id: "pay_demo_001",
      razorpay_signature: "sig_demo_001",
      status: "Success",
      date: new Date("2025-12-08"),
    },
    {
      order_id: orderIds[1],
      user_id: userIds[2],
      total_amount: 2400,
      deposit_amount: 1200,
      rent_amount: 1200,
      payment_type: "Razorpay",
      razorpay_order_id: "order_demo_002",
      razorpay_payment_id: "pay_demo_002",
      razorpay_signature: "sig_demo_002",
      status: "Success",
      date: new Date("2025-12-13"),
    },
  ]);

  console.log("✅ Payments seeded");

  // ── Feedbacks ─────────────────────────────────────────────────────────────
  await db.collection("feedbacks").insertMany([
    {
      user_id: userIds[1],
      booking_id: orderIds[0],
      rating: 5.0,
      feedback: "The Anarkali suit was absolutely stunning! Perfect fit and great quality. Will definitely rent again.",
      datetime: new Date("2025-12-15"),
    },
    {
      user_id: userIds[2],
      booking_id: orderIds[1],
      rating: 4.5,
      feedback: "Beautiful silk saree. Very affordable and the quality was excellent. Great service overall!",
      datetime: new Date("2025-12-18"),
    },
  ]);

  console.log("✅ Feedbacks seeded");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────────");
  console.log("👤 Admin   → admin@clothing.com  / Admin@123");
  console.log("👤 User 1  → priya@gmail.com     / Priya@123");
  console.log("👤 User 2  → riya@gmail.com      / Riya@123");
  console.log("──────────────────────────────────────────");

  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
