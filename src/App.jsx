import { useState, useEffect, useRef, useMemo } from "react";
import Toast from "./components/Toast";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      const dateTimeA = new Date(`${a.deadline}T${a.time}`);
      const dateTimeB = new Date(`${b.deadline}T${b.time}`);

      return dateTimeA - dateTimeB;
    });
  }, [todos]);

  const totalTodos = todos.length;

  const completedTodos = todos.filter((todo) => todo.completed).length;

  const pendingTodos = todos.filter((todo) => !todo.completed).length;

  const [toastMessage, setToastMessage] = useState("");

  const notifiedTasks = useRef(new Set());

  
useEffect(() => {
  const checkOverdueTasks = () => {
    const now = new Date();

    const overdueTasks = todos.filter((todo) => {
      const deadlineDateTime = new Date(
        `${todo.deadline}T${todo.time}`
      );

      return (
        deadlineDateTime <= now &&
        !todo.completed &&
        !notifiedTasks.current.has(todo.id)
      );
    });

    if (overdueTasks.length > 0) {
      const taskNames = overdueTasks
        .map((todo) => todo.title)
        .join(", ");

      setToastMessage(
        `"${taskNames}" is overdue!`
      );

      overdueTasks.forEach((todo) => {
        notifiedTasks.current.add(todo.id);
      });
    }
  };

  checkOverdueTasks();

  const interval = setInterval(
    checkOverdueTasks,
    10000
  );

  return () => clearInterval(interval);
}, [todos]);


  const addTodo = (task) => {
    setTodos([...todos, task]);
  };

  // Complete Task
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

  };

  // Delete Task
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Update Task

  const updateTodo = (id, updatedTask) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTask } : todo,
      ),
    );
  };

  return (
    <div className="app">
      <h1>My To-Do List</h1>

      <div className="todo-stats">
        <div className="stat-card">
          <h3>All Tasks</h3>
          <p>{totalTodos}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completedTodos}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pendingTodos}</p>
        </div>
      </div>

      <div className="form-container">
        <TodoForm addTodo={addTodo} todos={todos} />
      </div>

      <div className="tasks-container">
        <TodoList
          todos={sortedTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          setToastMessage={setToastMessage}
        />
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}

export default App;
