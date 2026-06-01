import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import vehicleRoutes from "./routes/vehicles.js";
import locationRoutes from "./routes/locations.js";
import optimizationRoutes from "./routes/optimization.js";

// Socket Handlers
import setupTrackingSocket from "./socket/trackingHandler.js";
import setupSimulationSocket from "./socket/simulationEngine.js";
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

console.log("MONGO_URI EXISTS:", !!process.env.MONGO_URI);
console.log("JWT_SECRET EXISTS:", !!process.env.JWT_SECRET);
console.log("NODE_ENV EXISTS:", !!process.env.NODE_ENV);

// Initialize Express app
const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://delivery-optimization-using-machine-pi.vercel.app",
  "https://deliveryoptimization.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    try {
      const url = new URL(origin);
      const hostname = url.hostname;
      if (
        hostname.endsWith(".vercel.app") &&
        (hostname.includes("deliveryoptimization") || hostname.includes("delivery-optimization"))
      ) {
        return callback(null, true);
      }
    } catch (err) {
      // invalid URL
    }

    // Support custom environment variable for origins
    if (process.env.ALLOWED_ORIGINS) {
      const customOrigins = process.env.ALLOWED_ORIGINS.split(",");
      if (customOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
};

// CORS Middleware
app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: corsOptions,
});

// Setup Socket Handlers
setupTrackingSocket(io);
setupSimulationSocket(io);
// Health Check / Version endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "9da236f_with_health_check",
    timestamp: new Date()
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/optimization", optimizationRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

// Start Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server & Socket.io running on port ${PORT}`);
});