import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },

    defaultAlgorithm: {
      type: String,
      enum: [
        "clarke-wright",
        "nearest-neighbor",
      ],
      default: "clarke-wright",
    },

    preferRoadNetwork: {
      type: Boolean,
      default: false,
    },
  },

  role: {
    type: String,
    enum: ['admin', 'agent', 'customer'],
    default: 'admin' // defaulting to admin for backward compatibility of current system
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre(
  "save",
  async function (next) {
    if (!this.isModified("password")) {
      return next();
    }

    try {
      const salt =
        await bcrypt.genSalt(10);

      this.password =
        await bcrypt.hash(
          this.password,
          salt
        );

      next();
    } catch (error) {
      next(error);
    }
  }
);

// Compare passwords
UserSchema.methods.comparePassword =
  async function (
    candidatePassword
  ) {
    return await bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

const User = mongoose.model(
  "User",
  UserSchema
);

export default User;