
// import { useEffect, useState } from "react";

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchTasks() {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/tasks"
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch tasks");
//         }

//         const data = await response.json();
//         setTasks(data);
//       } catch (error) {
//         setError("Could not load tasks. Is the backend running?");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTasks();
//   }, []);

//   return (
//     <main>
//       <h1>My Task Manager</h1>
//       <p>My tasks, one step at a time.</p>

//       {loading && <p>Loading tasks...</p>}
//       {error && <p>{error}</p>}

//       {!loading && !error && (
//         <ul>
//           {tasks.map((task) => (
//             <li key={task.id}>
//               {task.title} —{" "}
//               {task.completed ? "Completed" : "Pending"}
//             </li>
//           ))}
//         </ul>
//       )}

//       {!loading && !error && tasks.length === 0 && (
//         <p>No tasks yet. Add your first task soon!</p>
//       )}
//     </main>
//   );
// }

// export default App;



import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch {
      setError("Could not load tasks. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      setTasks((currentTasks) => [data, ...currentTasks]);
      setTitle("");
    } catch (error) {
      setError(error.message || "Could not create task");
    } finally {
      setSaving(false);
    }
  }

  
async function toggleTask(task) {
  try {
    const response = await fetch(`${API_URL}/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !Boolean(task.completed) }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not update task");
    }

    setTasks((current) =>
      current.map((item) => (item.id === task.id ? data : item))
    );
  } catch (error) {
    setError(error.message);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not delete task");
    }

    setTasks((current) => current.filter((task) => task.id !== id));
  } catch (error) {
    setError(error.message);
  }
}


  return (
    <main>
      <h1>My Task Manager</h1>
      <p>My tasks, one step at a time.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button type="submit" disabled={saving || !title.trim()}>
          {saving ? "Adding..." : "Add task"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <h2>Your tasks ({tasks.length})</h2>

          {tasks.length === 0 ? (
            <p>No tasks yet. Add your first one!</p>
          ) : (
            
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(task.completed)}
                    onChange={() => toggleTask(task)}
                  />
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                </label>

                <button type="button" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>

          )}
        </>
      )}
    </main>
  );
}

export default App;
