// Create the connection to the MongoDD database
// Dependencies
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connect to the database
const connectDB = () => {

    // Mongoose deprecation warning fix
    mongoose.set("strictQuery", false);

    // Connect to MongoDB
    mongoose.connect(process.env.DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useCreateIndex: true,
        });

    const conn = mongoose.connection;

    // Log the connection status
    conn.on('connected', () => {
        console.log(`We are inside Mongo! Welcome to: ${conn.name}`);
    });

    conn.on('disconnected', () => {
        console.log(`We are out of Mongo!`);
    });
    conn.on('error', (err) => {
        console.log(`We cannot enter in Mongo! Error:${err.message}`);
    })
}

export default connectDB;
