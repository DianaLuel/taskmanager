
// import express from "express";

// const app = express();
// const PORT = 5000;

// app.get("/", (req, res) => {
//   res.send("Task Manager API is running!");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./db.js";

const app = express();
const PORT = 5000;

// Middleware must come before routes
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Task Manager API is running!");
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error.message);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  const { title } = req.body ?? {};

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO tasks (title) VALUES (?)",
      [title.trim()]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM tasks WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Failed to create task:", error.message);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
