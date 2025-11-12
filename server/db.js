const mongoose = require("mongoose");
require('dotenv').config();

// My MongoDB connection with production-ready settings
const connectDB = async () => {
  let retries = 5; // Number of retry attempts
  while (retries) {
    try {
      // My connection options for better production performance
      const options = {
        serverSelectionTimeoutMS: 30000, // 30 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds socket timeout
        maxPoolSize: 10, // Maximum number of connections
        minPoolSize: 2, // Minimum number of connections
        autoIndex: false, // Disable automatic index creation in production
      };

      await mongoose.connect(process.env.MONGODB_URI, options);
      console.log("MongoDB connected successfully");

      // My connection event handlers for production monitoring
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      break; // Exit the retry loop on successful connection
    } catch (error) {
      console.error(`MongoDB connection failed. Retries left: ${retries - 1}`, error.message);
      retries -= 1;
      if (retries === 0) {
        console.error("All MongoDB connection attempts failed. Exiting process.");
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
};

module.exports = connectDB