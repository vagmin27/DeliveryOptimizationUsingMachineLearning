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

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://delivery-optimization-using-machine-pi.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-auth-token"
  ]
};

const io = new Server(httpServer, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    credentials: corsOptions.credentials,
  }
});

// Setup Socket Handlers
setupTrackingSocket(io);
setupSimulationSocket(io);

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/optimization", optimizationRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

// Start Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server & Socket.io running on port ${PORT}`);
});