require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { checkScheduleAndNotify } = require('./services/AttendenceTracker.js');

const subjectRoutes = require("./routes/subjectRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes");
const postRoutes = require('./routes/posts');

const app = express();

// Add this before other middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api', postRoutes);
setInterval(checkScheduleAndNotify, 60000);

// Add better error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

mongoose
  .connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, '0.0.0.0', () => {
      console.log("Server running on port 5000");
      console.log("Try accessing: http://localhost:5000/api/test");
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));
