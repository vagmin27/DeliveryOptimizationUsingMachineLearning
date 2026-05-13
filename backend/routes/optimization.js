import express from "express";

import auth from "../middleware/auth.js";
import * as optimizationController from "../controllers/optimization.js";

const router = express.Router();

// @route   GET api/optimization
// @desc    Get all optimizations
// @access  Private
router.get(
  "/",
  auth,
  optimizationController.getOptimizations
);

// @route   GET api/optimization/:id
// @desc    Get optimization by ID
// @access  Private
router.get(
  "/:id",
  auth,
  optimizationController.getOptimizationById
);

// @route   POST api/optimization
// @desc    Create optimization
// @access  Private
router.post(
  "/",
  auth,
  optimizationController.createOptimization
);

// @route   DELETE api/optimization/:id
// @desc    Delete optimization
// @access  Private
router.delete(
  "/:id",
  auth,
  optimizationController.deleteOptimization
);

// Get routed polyline
router.get(
  "/:id/route/:routeIndex/polyline",
  auth,
  optimizationController.getRoutedPolyline
);

export default router;