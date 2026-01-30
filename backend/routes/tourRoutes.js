import express from "express";
import {
    createTour,
    getAllTours,
    getTourById,
    updateTour,
    deleteTour
} from "../controllers/tourController.js";
// import { isAuthenticated } from "../middleware/isAuthenticated.js"; // Uncomment when auth is ready

const router = express.Router();

// Public routes
router.get("/", getAllTours);
router.get("/:id", getTourById);

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Admin routes (Protect these later)
router.post("/", upload.array("images", 10), createTour);
router.put("/:id", upload.array("images", 10), updateTour);
router.delete("/:id", deleteTour);

export default router;
