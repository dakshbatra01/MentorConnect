const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const http = require("http");
const authRoutes = require('./routes/auth.js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// My CORS configuration with production and development origins
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:5175", 
    "http://localhost:5176", 
    "http://localhost:3000"
];

// My environment-specific origin handling
if (process.env.ORIGIN) {
    allowedOrigins.push(process.env.ORIGIN);
}

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use('/api/auth/', authRoutes);

// My graceful server startup with proper error handling
const startServer = async () => {
    try {
        // My MongoDB connection first
        await connectDB();
        
        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();



