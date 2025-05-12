const mysql = require("mysql2/promise");
require("dotenv").config();

const MAX_RETRIES = 10;
const RETRY_INTERVAL = 5000; // 5 seconds

async function waitForDatabase() {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      console.log("Successfully connected to the database");
      await connection.end();
      return true;
    } catch (error) {
      retries++;
      console.log(
        `Database connection attempt ${retries} failed. Retrying in ${
          RETRY_INTERVAL / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }

  throw new Error("Could not connect to the database after maximum retries");
}

async function createPool() {
  await waitForDatabase();

  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

module.exports = { createPool, waitForDatabase };
