const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const requestRoutes = require("./routes/requestRoutes");
const historyRoutes = require("./routes/historyRoutes");
const environmentRoutes = require("./routes/environmentRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/environments", environmentRoutes);
app.use(errorMiddleware);

module.exports = app;
