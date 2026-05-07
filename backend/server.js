const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const commentRoutes = require("./routes/commentRoutes");

const app = express(); 

//  ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

//  middlewares
app.use(cors({
  origin: "http://localhost:5173", // or your frontend port
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static( path.join(__dirname, "uploads")));

//  routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/comments", commentRoutes)

//  connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

//  start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
