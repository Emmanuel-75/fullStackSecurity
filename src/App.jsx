import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";

const API_URL = "https://dummyjson.com/todos";

function TasksPage() {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) =>
        setTasks(
          data.todos.map((t) => ({
            id: t.id,
            title: t.todo,
            completed: t.completed,
          }))
        )
      )
      .catch(() => setError("Failed to load tasks"));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1250);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 1250);
    return () => clearTimeout(timer);
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Title is required");
      return;
    }
    setError("");

    const tempTask = { id: Date.now(), title: cleanTitle, completed: false };
    setTasks((prev) => [...prev, tempTask]);

    try {
      const res = await fetch(API_URL + "/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ todo: cleanTitle, completed: false, userId: 1 }),
      });
      const data = await res.json();
      const savedTask = { id: data.id, title: data.todo, completed: data.completed };
      setTasks((prev) => prev.map((t) => (t.id === tempTask.id ? savedTask : t)));
      setToast("Task created");
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));
      setError("Failed to create task");
    }

    setTitle("");
  }

  async function toggleComplete(task) {
    const updatedTask = { ...task, completed: !task.completed };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));

    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      setError("Failed to update task");
    }
  }

  async function handleDelete(task) {
    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast("Task removed");
    } catch {
      setTasks(prevTasks);
      setError("Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-10">
      <div className="w-[90%] md:w-[60%] bg-slate-900 p-6 rounded-xl shadow-xl flex flex-col gap-10 border border-slate-600">
        <h1 className="text-center text-3xl font-bold">Task Manager</h1>

        <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="e.g Complete today's task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl font-bold text-xl outline-none border-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 px-6 py-2 rounded font-bold active:scale-95 cursor-pointer text-xl"
          >
            + Add
          </button>
        </form>

        {error && <p className="text-rose-400 text-center">{error}</p>}

        {tasks.length === 0 && <p className="text-center text-zinc-500">No tasks yet</p>}

        <div className="grid gap-6 sm:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 hover:bg-gray-800/60 shadow-md hover:shadow-lg p-4 rounded-lg flex flex-col gap-3 justify-between transition-all duration-500 ease-in-out hover:-translate-y-2 hover:ring-2 border border-zinc-700 hover:border-amber-500 hover:shadow-amber-900/40"
            >
              <p className={`font-semibold ${task.completed ? "line-through text-zinc-500" : ""}`}>
                {task.title}
              </p>
              <div className="flex gap-2 justify-between">
                <button
                  onClick={() => toggleComplete(task)}
                  className="text-teal-400 hover:text-teal-300 flex gap-1 cursor-pointer hover:font-bold"
                >
                  {task.completed ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big-icon lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>)}
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => handleDelete(task)}
                  className="text-red-500 hover:text-red-400 flex gap-1 cursor-pointer hover:font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-black px-6 py-3 rounded-lg shadow-lg shadow-emerald-900/50">
          {toast}
        </div>
      )}
    </div>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  return <LoginPage onLoginSuccess={() => navigate("/")} handleLogin={handleLogin} />;
}

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <TasksPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}