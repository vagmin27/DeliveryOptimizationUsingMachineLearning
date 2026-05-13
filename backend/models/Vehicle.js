import mongoose from "mongoose";

const VehicleSchema =
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    count: {
      type: Number,
      required: true,
      default: 1,
    },

    maxDistance: {
      type: Number,
      default: 100000, // 100km
    },

    date: {
      type: Date,
      default: Date.now,
    },
  });

const Vehicle = mongoose.model(
  "Vehicle",
  VehicleSchema
);

export default Vehicle;