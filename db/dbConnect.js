const { MongoClient } = require("mongodb");

const connectDB = async () => {
  const dbUrl = process.env.MONGO_URI;
  try {
    const client = await MongoClient.connect(dbUrl);
    console.log("DB Connected!");
    return client.db();
  } catch (error) {
    console.log("DB Connection Error: ", error);
    throw error;
  }
};

module.exports = connectDB;
