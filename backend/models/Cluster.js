import mongoose from "mongoose";

const ClusterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  centroid: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  bounds: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: false } // Array of coordinate arrays for Polygon
  },
  activeParcels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcel"
  }],
  assignedAgents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAgent"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ClusterSchema.index({ centroid: "2dsphere" });

const Cluster = mongoose.model("Cluster", ClusterSchema);
export default Cluster;
