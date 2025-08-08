const mongoose = require("mongoose");

require("dotenv").config(); // Load variables from .env

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not defined. Check your .env file.");
  process.exit(1);
}
mongoose.connect(uri);

mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) =>
  console.error("DB connection error:", err)
);
module.exports = mongoose;
