
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
import "dotenv/config";
import pool from "./db.js";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Manager API is running!");
});

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
