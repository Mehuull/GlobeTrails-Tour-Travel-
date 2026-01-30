import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// Get overall stats (Add role check middleware here if available)
router.get("/stats", getDashboardStats);

export default router;
