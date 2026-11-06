
import { useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (task) => {
    setTodos([...todos, task]);
  };

  return (
    <div className="app">
      <h1>My To-Do List</h1>

      <TodoForm addTodo={addTodo} />

      <TodoList todos={todos} />
    </div>
  );
}

export default App;
