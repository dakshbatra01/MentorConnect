const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const http = require("http");
const authRoutes = require('./routes/auth.js');


connectDB();
const app = express();
const server = http.createServer(app);


app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use('/api/auth/', authRoutes);


server.listen(4000, () => {
  console.log("Server is running on port 4000");
});



