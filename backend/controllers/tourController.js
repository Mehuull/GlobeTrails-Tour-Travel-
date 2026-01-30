import { Tour } from "../models/Tour.js";
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';


dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Supabase URL or Key missing in .env file!");
}
let supabase;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn("Supabase URL or Key missing in environment variables. Image upload will be disabled.");
}

// Create a new tour
export const createTour = async (req, res) => {
    try {
        console.log("Tour data received:", req.body);
        let tourData = req.body;
        let imageUrls = [];

        // Parse nested JSON strings if coming from FormData
        try {
            if (typeof tourData.duration === 'string') tourData.duration = JSON.parse(tourData.duration);
            if (typeof tourData.itinerary === 'string') tourData.itinerary = JSON.parse(tourData.itinerary);
            if (typeof tourData.inclusions === 'string') tourData.inclusions = JSON.parse(tourData.inclusions);
            if (typeof tourData.exclusions === 'string') tourData.exclusions = JSON.parse(tourData.exclusions);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return res.status(400).json({ success: false, message: "Invalid JSON format for nested fields", error: parseError.message });
        }


        if (req.files && req.files.length > 0) {
            console.log(`Uploading ${req.files.length} images to Supabase...`);

            if (!supabase) {
                return res.status(500).json({
                    success: false,
                    message: "Server configuration error: Supabase not configured. Check .env file.",
                });
            }

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                // Sanitize filename to avoid specific characters
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
                // User indicated 'tourimages' is a folder inside the bucket.
                // Assuming the bucket name is provided via env var SUPABASE_BUCKET_NAME.
                // We will upload to 'tourimages/filename'.
                const filePath = `toursimages/${Date.now()}-${sanitizedOriginalName}`;

                console.log(`Uploading to: ${filePath}`);

                const bucketName = "tourimages"; // User hardcoded string

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: false,
                    });

                if (error) {
                    console.error("Error uploading to Supabase:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Image upload failed: " + error.message,
                        error: error,
                    });
                }

                const { data: publicUrlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                console.log(`Uploaded image URL: ${publicUrlData.publicUrl}`);
                imageUrls.push(publicUrlData.publicUrl);
            }
        }

        // Handle mixed image sources (existing strings + new uploads)
        let existingImages = [];
        if (typeof tourData.images === 'string') {
            existingImages = tourData.images.split(',').map(s => s.trim()).filter(s => s);
        } else if (Array.isArray(tourData.images)) {
            existingImages = tourData.images.filter(s => typeof s === 'string');
        }

        tourData.images = [...existingImages, ...imageUrls];

        console.log("Saving tour to database...");
        const tour = new Tour(tourData);
        await tour.save();
        console.log("Tour saved successfully:", tour._id);
        res.status(201).json({ success: true, message: "Tour created successfully", data: tour });
    } catch (error) {
        console.error("Create Tour Error:", error);
        res.status(500).json({ success: false, message: "Failed to create tour", error: error.message });
    }
};

// Get all tours
export const getAllTours = async (req, res) => {
    try {
        const { location, category, maxGroupSize } = req.query;
        let query = {};

        if (location) {
            // Search in itinerary.locationsCovered or title using regex for partial match
            query.$or = [
                { "itinerary.locationsCovered": { $regex: location, $options: "i" } },
                { title: { $regex: location, $options: "i" } }
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: "i" };
        }

        if (maxGroupSize) {
            query.maxGroupSize = { $gte: parseInt(maxGroupSize) };
        }

        const tours = await Tour.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tours.length, data: tours });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch tours", error: error.message });
    }
};

// Get single tour
export const getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ success: false, message: "Tour not found" });
        }
        res.status(200).json({ success: true, data: tour });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch tour", error: error.message });
    }
};

// Update tour
export const updateTour = async (req, res) => {
    try {
        let tourData = req.body;
        let imageUrls = [];

        // Parse nested JSON strings if coming from FormData
        try {
            if (typeof tourData.duration === 'string') tourData.duration = JSON.parse(tourData.duration);
            if (typeof tourData.itinerary === 'string') tourData.itinerary = JSON.parse(tourData.itinerary);
            if (typeof tourData.inclusions === 'string') tourData.inclusions = JSON.parse(tourData.inclusions);
            if (typeof tourData.exclusions === 'string') tourData.exclusions = JSON.parse(tourData.exclusions);
        } catch (parseError) {
            console.error("JSON Parse Error during update:", parseError);
            return res.status(400).json({ success: false, message: "Invalid JSON format for nested fields", error: parseError.message });
        }

        // Handle Image Uploads
        if (req.files && req.files.length > 0) {
            if (!supabase) {
                return res.status(500).json({ success: false, message: "Supabase not configured" });
            }

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
                const filePath = `toursimages/${Date.now()}-${sanitizedOriginalName}`;
                const bucketName = "tourimages";

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

                if (error) {
                    return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
                }

                const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
                imageUrls.push(publicUrlData.publicUrl);
            }
        }

        // Handle existing images string (FormData sends arrays as comma separated strings sometimes)
        let existingImages = [];
        if (typeof tourData.images === 'string') {
            existingImages = tourData.images.split(',').map(s => s.trim()).filter(s => s);
        } else if (Array.isArray(tourData.images)) {
            existingImages = tourData.images.filter(s => typeof s === 'string');
        }

        // Combine old and new images
        tourData.images = [...existingImages, ...imageUrls];

        const tour = await Tour.findByIdAndUpdate(req.params.id, tourData, { new: true, runValidators: true });

        if (!tour) {
            return res.status(404).json({ success: false, message: "Tour not found" });
        }

        res.status(200).json({ success: true, message: "Tour updated", data: tour });
    } catch (error) {
        console.error("Update Tour Error:", error);
        res.status(400).json({ success: false, message: "Failed to update tour", error: error.message });
    }
};

// Delete tour
export const deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) {
            return res.status(404).json({ success: false, message: "Tour not found" });
        }
        res.status(200).json({ success: true, message: "Tour deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete tour", error: error.message });
    }
};
