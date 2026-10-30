import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// const connectDB = async () => {
//     if (mongoose.connection.readyState >= 1) return;

//     try {
//         if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== 'string') {
//             throw new Error("MONGO_URI is missing or invalid in environment variables");
//         }

//         // Clean trailing slash and append DB name
//         let baseUri = process.env.MONGO_URI.trim();
//         if (baseUri.endsWith('/')) {
//             baseUri = baseUri.slice(0, -1);
//         }

//         // If it already has a database name in the path (after the host), don't append GlobeTrails
//         // A simple check: if there is a / after the protocol's //
//         const parts = baseUri.split('/');
//         // mongodb+srv://host or mongodb://host
//         // parts[0] is protocol, parts[1] is empty, parts[2] is host[:port]
//         // If parts.length > 3, it might already have a DB name.

//         let uri;
//         if (parts.length > 3 && parts[3].length > 0) {
//             uri = baseUri; // Use as is
//         } else {
//             uri = `${baseUri}/GlobeTrails`;
//         }

//         // Handle query parameters if they were present
//         if (process.env.MONGO_URI.includes('?')) {
//             const query = process.env.MONGO_URI.split('?')[1];
//             if (!uri.includes('?')) {
//                 uri = `${uri}?${query}`;
//             }
//         }

//         console.log('Connecting to MongoDB...');
//         await mongoose.connect(uri);
//         console.log('MongoDB connected successfully');

//     } catch (error) {
//         console.error('MongoDB connection error:', error.message);
//         // Throw the error so the calling function knows we failed
//         throw error;
//     }
// }

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== 'string') {
            throw new Error("MONGO_URI is missing or invalid in environment variables");
        }

        const configuredUri = process.env.MONGO_URI.trim();
        const [baseUri, queryString] = configuredUri.split("?");
        const normalizedBaseUri = baseUri.replace(/\/+$/, "");
        const authorityEnd = normalizedBaseUri.indexOf(
            "/",
            normalizedBaseUri.indexOf("//") + 2
        );
        const databasePath = authorityEnd === -1
            ? `${normalizedBaseUri}/GlobeTrails`
            : normalizedBaseUri;
        const mongoUri = queryString
            ? `${databasePath}?${queryString}`
            : databasePath;

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Throw the error so the calling function knows we failed
        throw error;
    }
}

export default connectDB;