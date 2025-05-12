const cron = require("node-cron");
const Scheduler = require("../models/scheduler");

class SchedulerService {
  constructor() {
    this.jobs = new Map();
  }

  // Validate cron expression
  isValidCronExpression(cronTime) {
    return cron.validate(cronTime);
  }

  // Initialize hardcoded schedules
  async initializeSchedules() {
    const hardcodedSchedules = [
      {
        name: "Every Minute Task",
        cronTime: "* * * * *",
        isActive: true,
        task: "minuteTask",
      },
      {
        name: "Every 5 Minutes Task",
        cronTime: "*/5 * * * *",
        isActive: true,
        task: "fiveMinuteTask",
      },
      {
        name: "Hourly Task",
        cronTime: "0 * * * *",
        isActive: true,
        task: "hourlyTask",
      },
    ];

    // Save schedules to database
    for (const schedule of hardcodedSchedules) {
      await Scheduler.create(schedule);
    }

    // Start all schedules
    await this.startAllSchedules();
  }

  // Start all active schedules
  async startAllSchedules() {
    const schedules = await Scheduler.findAll();

    for (const schedule of schedules) {
      if (schedule.isActive) {
        this.startSchedule(schedule);
      }
    }
  }

  // Start a single schedule
  startSchedule(schedule) {
    if (this.jobs.has(schedule.id)) {
      this.jobs.get(schedule.id).stop();
    }

    const job = cron.schedule(schedule.cronTime, () => {
      this.executeTask(schedule.task);
    });

    this.jobs.set(schedule.id, job);
    console.log(`Started schedule: ${schedule.name} (${schedule.cronTime})`);
  }

  // Stop a schedule
  stopSchedule(scheduleId) {
    if (this.jobs.has(scheduleId)) {
      this.jobs.get(scheduleId).stop();
      this.jobs.delete(scheduleId);
      console.log(`Stopped schedule ID: ${scheduleId}`);
    }
  }

  // Execute the scheduled task
  executeTask(taskName) {
    console.log(`Executing task: ${taskName} at ${new Date().toISOString()}`);

    switch (taskName) {
      case "minuteTask":
        this.minuteTask();
        break;
      case "fiveMinuteTask":
        this.fiveMinuteTask();
        break;
      case "hourlyTask":
        this.hourlyTask();
        break;
      default:
        console.log(`Unknown task: ${taskName}`);
    }
  }

  // Example task implementations
  minuteTask() {
    console.log("Running task every minute");
    // Add your task logic here
  }

  fiveMinuteTask() {
    console.log("Running task every 5 minutes");
    // Add your task logic here
  }

  hourlyTask() {
    console.log("Running task every hour");
    // Add your task logic here
  }
}

module.exports = new SchedulerService();
