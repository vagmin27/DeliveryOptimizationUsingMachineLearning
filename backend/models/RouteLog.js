import mongoose from "mongoose";

const RouteLogSchema = new mongoose.Schema({
  optimizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Optimization"
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAgent"
  },
  clusterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cluster"
  },
  estimatedTime: {
    type: Number, // in minutes
  },
  actualTime: {
    type: Number,
  },
  estimatedDistance: {
    type: Number,
  },
  actualDistance: {
    type: Number,
  },
  fuelSaved: {
    type: Number,
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RouteLog = mongoose.model("RouteLog", RouteLogSchema);
export default RouteLog;
