import express from "express";

import auth from "../middleware/auth.js";
import * as authController from "../controllers/auth.js";

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  authController.register
);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  authController.login
);

// @route   GET api/auth
// @desc    Get user data
// @access  Private
router.get(
  "/",
  auth,
  authController.getUser
);

// @route   GET api/auth/preferences
// @desc    Get user preferences
// @access  Private
router.get(
  "/preferences",
  auth,
  authController.getPreferences
);

// @route   PUT api/auth/preferences
// @desc    Update user preferences
// @access  Private
router.put(
  "/preferences",
  auth,
  authController.updatePreferences
);

export default router;