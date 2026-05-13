import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },

  demand: {
    type: Number,
    default: 0,
  },

  isDepot: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Location = mongoose.model(
  "Location",
  LocationSchema
);

export default Location;