const express = require("express");
const cors = require("cors");
const schedulerService = require("./services/schedulerService");
const db = require("./config/database");
const schedulerRoutes = require("./routes/schedulerRoutes");
const requestLogger = require("./middleware/requestLogger");
const logger = require("./config/logger");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/schedules", schedulerRoutes);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await db.initializePool();
    logger.info("Database connection established");

    // Initialize scheduler
    await schedulerService.initializeSchedules();
    logger.info("Scheduler initialized successfully");

    // Start server
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express.js with MySQL!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled Error", {
    error: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
startServer();
