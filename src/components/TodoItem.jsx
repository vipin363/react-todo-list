
import { useState } from "react";

function TodoItem({
  todo,
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
  setToastMessage,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDeadline, setEditDeadline] = useState(todo.deadline);
  const [editTime, setEditTime] = useState(todo.time);

  const [editConfirmed, setEditConfirmed] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

 

  // Get local date
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

  // Edit Task
  const handleEdit = () => {
    setEditTitle(todo.title);
    setEditDeadline(todo.deadline);
    setEditTime(todo.time);

    setEditConfirmed(false);
    setToastMessage("");


    setIsEditing(true);
  };

  // Save Updated Task

const handleUpdate = () => {
  const trimmedTitle = editTitle.trim();

  const letters = trimmedTitle.match(/\p{L}/gu) || [];

  if (letters.length < 3) {
    setToastMessage("Title must contain at least 3 letters.");
    return;
  }

  if (!editDeadline || !editTime) {
    setToastMessage("Please select date and time.");
    return;
  }

  const selectedDateTime = new Date(
    `${editDeadline}T${editTime}`
  );

  if (selectedDateTime <= new Date()) {
    setToastMessage("Past date and time are not allowed.");
    return;
  }

  const duplicate = todos.some(
    (item) =>
      item.id !== todo.id &&
      item.title.trim().toLowerCase() ===
        trimmedTitle.toLowerCase()
  );

  if (duplicate) {
    setToastMessage("This task already exists.");
    return;
  }

  if (!editConfirmed) {
    setToastMessage("Please confirm before updating.");
    return;
  }

 
updateTodo(todo.id, {
  title: trimmedTitle,
  deadline: editDeadline,
  time: editTime,
  completed: false,
});

setIsEditing(false);
setEditConfirmed(false);
// setToastMessage("Task updated successfully!");

};


  // Cancel Edit
  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDeadline(todo.deadline);
    setEditTime(todo.time);

    setIsEditing(false);
    setEditConfirmed(false);
     setToastMessage("");
  };

  // Delete Task
 
const handleDelete = () => {
  if (!deleteConfirmed) {
    setToastMessage("Please confirm before deleting.");
    return;
  }

  deleteTodo(todo.id);
  setDeleteConfirmed(false);
};


  return (
    <div className={`task-card ${todo.completed ? "completed" : ""}`}>
      <div className="task-details">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                setToastMessage("");
              }}
            />

            <input
              type="date"
              min={getLocalDate()}
              value={editDeadline}
              onChange={(e) => {
                setEditDeadline(e.target.value);
                setToastMessage("");
              }}
            />

            <input
              type="time"
              min={
                editDeadline === getLocalDate()
                  ? getCurrentTime()
                  : "00:00"
              }
              value={editTime}
              onChange={(e) => {
                setEditTime(e.target.value);
                setToastMessage("");
              }}
            />
          </>
        ) : (
          <h3>{todo.title}</h3>
        )}

       
{!isEditing && (
  <>
    <p>
      <strong>Date:</strong> {todo.deadline}
    </p>

    <p>
      <strong>Time:</strong>{" "}
      {new Date(
        `2000-01-01T${todo.time}`
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    </p>

    <p>
      <strong>Status:</strong>{" "}
      {todo.completed ? "Completed" : "Pending"}
    </p>
  </>
)}


       
      </div>

      <div className="task-actions">
        {!todo.completed && !isEditing && (
          <button
            className="complete-btn"
            onClick={() => toggleTodo(todo.id)}
          >
            Complete
          </button>
        )}

        {isEditing ? (
          <>
            
<label className="confirm-box">
  <input
    type="checkbox"
    checked={editConfirmed}
    onChange={(e) => setEditConfirmed(e.target.checked)}
  />

  <span className="custom-checkbox"></span>

  <span className="confirm-text">
    Confirm Update
  </span>
</label>


            <button className="save-btn" onClick={handleUpdate}>
              Save
            </button>

            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button
  type="button"
  className="edit-btn"
  onClick={handleEdit}
>
  Edit
</button>
        )}

        {!isEditing && (
          <>
            
<label className="confirm-box">
  <input
    type="checkbox"
    checked={deleteConfirmed}
    onChange={(e) => {
      setDeleteConfirmed(e.target.checked);
     setToastMessage("");
    }}
  />

  <span className="custom-checkbox"></span>

  <span className="confirm-text">
    Confirm Delete
  </span>
</label>

            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
