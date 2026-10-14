
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tasks"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setError("Could not load tasks. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <main>
      <h1>My Task Manager</h1>
      <p>My tasks, one step at a time.</p>

      {loading && <p>Loading tasks...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} —{" "}
              {task.completed ? "Completed" : "Pending"}
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p>No tasks yet. Add your first task soon!</p>
      )}
    </main>
  );
}

export default App;
