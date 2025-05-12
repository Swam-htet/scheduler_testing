const { createPool } = require("../utils/dbConnection");

let pool;

async function initializePool() {
  if (!pool) {
    pool = await createPool();
  }
  return pool;
}

module.exports = {
  getPool: () => {
    if (!pool) {
      throw new Error(
        "Database pool not initialized. Call initializePool() first."
      );
    }
    return pool;
  },
  initializePool,
};
