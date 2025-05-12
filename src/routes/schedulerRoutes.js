const express = require("express");
const router = express.Router();
const Scheduler = require("../models/scheduler");
const schedulerService = require("../services/schedulerService");

// Get all schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Scheduler.findAll();
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
});

// Get schedule by ID
router.get("/:id", async (req, res) => {
  try {
    const schedule = await Scheduler.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// Create new schedule
router.post("/", async (req, res) => {
  try {
    const { name, cronTime, isActive, task } = req.body;

    // Validate required fields
    if (!name || !cronTime || !task) {
      return res.status(400).json({
        error: "Missing required fields: name, cronTime, and task are required",
      });
    }

    // Validate cron expression
    if (!schedulerService.isValidCronExpression(cronTime)) {
      return res.status(400).json({
        error: "Invalid cron expression",
      });
    }

    const scheduleId = await Scheduler.create({
      name,
      cronTime,
      isActive: isActive ?? true,
      task,
    });

    const newSchedule = await Scheduler.findById(scheduleId);

    // Start the new schedule if it's active
    if (newSchedule.isActive) {
      schedulerService.startSchedule(newSchedule);
    }

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ error: "Failed to create schedule" });
  }
});

// Update schedule
router.put("/:id", async (req, res) => {
  try {
    const { name, cronTime, isActive, task } = req.body;
    const scheduleId = req.params.id;

    // Check if schedule exists
    const existingSchedule = await Scheduler.findById(scheduleId);
    if (!existingSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Validate cron expression if provided
    if (cronTime && !schedulerService.isValidCronExpression(cronTime)) {
      return res.status(400).json({ error: "Invalid cron expression" });
    }

    const updated = await Scheduler.update(scheduleId, {
      name: name ?? existingSchedule.name,
      cronTime: cronTime ?? existingSchedule.cronTime,
      isActive: isActive ?? existingSchedule.isActive,
      task: task ?? existingSchedule.task,
    });

    if (updated) {
      const updatedSchedule = await Scheduler.findById(scheduleId);

      // Restart the schedule if it's active
      if (updatedSchedule.isActive) {
        schedulerService.startSchedule(updatedSchedule);
      } else {
        schedulerService.stopSchedule(scheduleId);
      }

      res.json(updatedSchedule);
    } else {
      res.status(500).json({ error: "Failed to update schedule" });
    }
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Failed to update schedule" });
  }
});

// Delete schedule
router.delete("/:id", async (req, res) => {
  try {
    const scheduleId = req.params.id;

    // Check if schedule exists
    const existingSchedule = await Scheduler.findById(scheduleId);
    if (!existingSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Stop the schedule if it's running
    schedulerService.stopSchedule(scheduleId);

    const deleted = await Scheduler.delete(scheduleId);
    if (deleted) {
      res.json({ message: "Schedule deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete schedule" });
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ error: "Failed to delete schedule" });
  }
});

module.exports = router;
