import mongoose from "mongoose";

const INCLUSIONS = [
    "Pickup & Drop from Airport / Railway Station",
    "Accommodation in Hotel",
    "Daily Breakfast",
    "Sightseeing as per itinerary",
    "All Transfers by Private Vehicle",
    "Driver Allowance, Toll & Parking",
    "All Applicable Taxes"
];

const EXCLUSIONS = [
    "Airfare",
    "Train Fare",
    "Personal Expenses",
    "Travel Insurance",
    "Entry Fees to Monuments",
    "Adventure Activities Charges",
    "Anything not mentioned in Inclusions"
];

const CATEGORIES = [
    "Adventure Tour",
    "Wildlife Tour",
    "Beach Tour",
    "Heritage Tour",
    "Hill Station Tour",
    "Pilgrimage Tour",
    "Honeymoon Tour",
    "Family Tours",
    "Eco / Nature Tour"
];

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: CATEGORIES,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    duration: {
        days: {
            type: Number,
            required: true
        },
        nights: {
            type: Number,
            required: true
        }
    },

    pricePerPerson: {
        type: Number,
        required: true
    },

    maxGroupSize: {
        type: Number,
        required: true
    },

    // DAY-WISE ITINERARY WITH LOCATIONS
    itinerary: [
        {
            dayNumber: {
                type: Number,
                required: true
            },

            title: {
                type: String,
                required: true
            },

            locationsCovered: [
                {
                    type: String
                }
            ],

            description: {
                type: String,
                required: true
            },

            overnightStay: {
                type: String
            }
        }
    ],

    // FIXED ENUM INCLUSIONS
    inclusions: [
        {
            type: String,
            enum: INCLUSIONS
        }
    ],

    // FIXED ENUM EXCLUSIONS
    exclusions: [
        {
            type: String,
            enum: EXCLUSIONS
        }
    ],

    images: [String],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Tour = mongoose.model("Tour", tourSchema);
export { Tour, INCLUSIONS, EXCLUSIONS };
