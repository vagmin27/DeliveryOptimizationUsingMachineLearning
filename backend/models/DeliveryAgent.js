import mongoose from "mongoose";

const DeliveryAgentSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'van', 'truck', 'drone'],
    required: true
  },
  capacity: {
    type: Number, // kg or cubic units
    required: true
  },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  performanceScore: {
    type: Number,
    default: 100 // Out of 100
  },
  historicalEfficiency: {
    type: Number,
    default: 0
  },
  routeCompletionRate: {
    type: Number,
    default: 0 // Percentage
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

DeliveryAgentSchema.index({ currentLocation: "2dsphere" });

const DeliveryAgent = mongoose.model("DeliveryAgent", DeliveryAgentSchema);
export default DeliveryAgent;
