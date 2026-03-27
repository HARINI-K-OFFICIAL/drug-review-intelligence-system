import dotenv from "dotenv";

// ✅ Load env variables FIRST
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.js";
import drugRoutes from "./routes/drugs.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Config
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/drugs", drugRoutes);
app.use("/api/reviews", reviewRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Drug Review Intelligence System Backend Running (No DB)");
});

// Server start
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT} (MongoDB Removed)`);
});