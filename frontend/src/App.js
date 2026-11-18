import React, { useEffect, useState } from "react";
import taskService from "./taskService";
import "./App.css";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED"];
const EMPTY_FORM = { title: "", description: "", status: "PENDING", dueDate: "" };

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  const loadTasks = () => {
    const request =
      filter === "ALL" ? taskService.getAll() : taskService.getByStatus(filter);

    request
      .then((res) => setTasks(res.data))
      .catch(() => setError("Could not reach the server. Is the backend running on :8080?"));
  };

  useEffect(loadTasks, [filter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");

    const action = editingId
      ? taskService.update(editingId, form)
      : taskService.create(form);

    action
      .then(() => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        loadTasks();
      })
      .catch(() => setError("Something went wrong while saving the task."));
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      dueDate: task.dueDate || "",
    });
  };

  const handleDelete = (id) => {
    taskService.remove(id).then(loadTasks);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <p className="subtitle">Spring Boot REST API + React</p>

      {error && <div className="error">{error}</div>}

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Task</button>
        {editingId && (
          <button type="button" className="secondary" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <div className="filter-bar">
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <ul className="task-list">
        {tasks.length === 0 && <li className="empty">No tasks yet.</li>}
        {tasks.map((task) => (
          <li key={task.id} className={`task-card status-${task.status.toLowerCase()}`}>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="meta">
                {task.status.replace("_", " ")}
                {task.dueDate ? ` · due ${task.dueDate}` : ""}
              </span>
            </div>
            <div className="task-actions">
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
