import mongoose from "mongoose";

const ParcelSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  origin: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  destination: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  weight: {
    type: Number,
    default: 1
  },
  volume: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'delivered', 'failed'],
    default: 'pending'
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAgent"
  },
  clusterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cluster"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ParcelSchema.index({ origin: "2dsphere" });
ParcelSchema.index({ destination: "2dsphere" });

const Parcel = mongoose.model("Parcel", ParcelSchema);
export default Parcel;
