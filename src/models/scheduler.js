const mysql = require("mysql2/promise");
const db = require("../config/database");

class Scheduler {
  static async create(schedulerData) {
    const { name, cronTime, isActive, task } = schedulerData;
    const pool = db.getPool();
    const [result] = await pool.execute(
      "INSERT INTO scheduler (name, cronTime, isActive, task) VALUES (?, ?, ?, ?)",
      [name, cronTime, isActive, task]
    );
    return result.insertId;
  }

  static async findAll() {
    const pool = db.getPool();
    const [rows] = await pool.execute("SELECT * FROM scheduler");
    return rows;
  }

  static async findById(id) {
    const pool = db.getPool();
    const [rows] = await pool.execute("SELECT * FROM scheduler WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async update(id, schedulerData) {
    const { name, cronTime, isActive, task } = schedulerData;
    const pool = db.getPool();
    const [result] = await pool.execute(
      "UPDATE scheduler SET name = ?, cronTime = ?, isActive = ?, task = ? WHERE id = ?",
      [name, cronTime, isActive, task, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const pool = db.getPool();
    const [result] = await pool.execute("DELETE FROM scheduler WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = Scheduler;
