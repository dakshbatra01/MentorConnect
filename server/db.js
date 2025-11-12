const mongoose = require("mongoose");
require('dotenv').config();

// My MongoDB connection with production-ready settings
const connectDB = async () => {
  try {
    // My connection options for better production performance
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering for commands
      maxPoolSize: 10, // Maximum number of connections
      minPoolSize: 2, // Minimum number of connections
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

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process on connection failure
  }
};

module.exports = connectDB