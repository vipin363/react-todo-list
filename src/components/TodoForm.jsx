
import { useState, useRef, useEffect } from "react";
import Toast from "./Toast";

function TodoForm({ addTodo, todos }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  // Get current local date
  const getLocalDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Get current local time
  const getCurrentTime = () => {
    const date = new Date();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  // Focus input when page loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Toast notification
  const showError = (message) => {
    setError(message);
  };

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = getLocalDate();

    if (selectedDate < today) {
      showError("Past dates are not allowed!");
      setDeadline("");
      setTime("");
      return;
    }

    setDeadline(selectedDate);
    setError("");

    // Reset time if selected time is in the past
    if (
      selectedDate === today &&
      time &&
      time < getCurrentTime()
    ) {
      setTime("");
    }
  };

  // Handle time change
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const today = getLocalDate();

    if (!deadline) {
      showError("Please select a date first!");
      setTime("");
      return;
    }

    if (
      deadline === today &&
      selectedTime < getCurrentTime()
    ) {
      showError("Past time is not allowed!");
      setTime("");
      return;
    }

    setTime(selectedTime);
    setError("");
  };

  // Handle Add Task
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    // Title validation
    const letters = trimmedTitle.match(/\p{L}/gu) || [];

    if (letters.length < 3) {
      showError("Title must contain at least 3 letters.");
      return;
    }

    // Date and time required
    if (!deadline || !time) {
      showError("Please select both date and time.");
      return;
    }

    // Validate past date and time
    const selectedDateTime = new Date(`${deadline}T${time}`);
    const now = new Date();

    if (selectedDateTime <= now) {
      showError("Past date and time are not allowed!");
      return;
    }

    // Duplicate task validation
    const duplicate = todos.some(
      (todo) =>
        todo.title.trim().toLowerCase() ===
        trimmedTitle.toLowerCase()
    );

    if (duplicate) {
      showError("This task already exists!");
      return;
    }

    // Confirmation validation
    if (!confirmed) {
      showError("Please confirm before adding the task.");
      return;
    }

    // Create new task
    const newTask = {
      id: Date.now(),
      title: trimmedTitle,
      deadline,
      time,
      completed: false,
    };

    addTodo(newTask);

    // Reset form
    setTitle("");
    setDeadline("");
    setTime("");
    setConfirmed(false);
    setError("");

    inputRef.current?.focus();
  };

  return (
    <>
      <form className="todo-form" onSubmit={handleSubmit}>
        {/* Task Name */}
        <input
          ref={inputRef}
          className="task-input"
          type="text"
          placeholder="Enter task name"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />

        {/* Deadline Date */}
        <input
          className="date-input"
          type="date"
          min={getLocalDate()}
          value={deadline}
          onChange={handleDateChange}
        />

        {/* Deadline Time */}
        <input
          className="time-input"
          type="time"
          min={
            deadline === getLocalDate()
              ? getCurrentTime()
              : "00:00"
          }
          value={time}
          onChange={handleTimeChange}
        />

        {/* Confirmation Checkbox */}
        <label className="confirm-box">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked);
              setError("");
            }}
          />

          <span className="custom-checkbox"></span>

          <span className="confirm-text">
            Confirm
          </span>
        </label>

        {/* Add Task Button */}
        <button className="add-btn" type="submit">
          + Add Task
        </button>
      </form>

      {/* Toast Notification */}
      <Toast
        message={error}
        onClose={() => setError("")}
      />
    </>
  );
}

export default TodoForm;
