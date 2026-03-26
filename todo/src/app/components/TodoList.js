"use client";

import { useState } from "react";

export default function TodoList({ initialTodos }) {
 const [todos, setTodos] = useState(initialTodos);
 const [title, setTitle] = useState("");

 const [editingId, setEditingId] = useState(null);
const [editTitle, setEditTitle] = useState("");

 async function addTodo() {
 const res = await fetch("/api/todos", {
 method: "POST",
 body: JSON.stringify({ title }),
 });

 const newTodo = await res.json();
 setTodos([newTodo, ...todos]);
 setTitle("");
 }

 async function deleteTodo(id) {
 await fetch(`/api/todos/${id}`, { method: "DELETE" });

 setTodos(todos.filter(t => t.id !== id));
 }

 async function toggleTodo(todo) {
 const res = await fetch(`/api/todos/${todo.id}`, {
 method: "PUT",
 body: JSON.stringify({
 title: todo.title,
 completed: !todo.completed
 })
 });

 const updated = await res.json();

 setTodos(
 todos.map(t => (t.id === updated.id ? updated : t))
 );
 }

 async function updateTodo(id) {

  const todo = todos.find(t => t.id === id);

  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: editTitle,
      completed: todo.completed
    })
  });

  const updated = await res.json();

  setTodos(
    todos.map(t => (t.id === updated.id ? updated : t))
  );

  setEditingId(null);
}


 return (
 <div >

<div className="flex items-center justify-center">
    <input
 value={title}
 onChange={e => setTitle(e.target.value)}
 placeholder="New Todo"
 className="border-2"
 maxLength={30}
 />

 <button onClick={addTodo} className="bg-blue-500 px-4 py-2 rounded-md ml-2 text-white">Add</button>
</div>
 

 <div className="bg-zinc-200 text-zinc-700 mt-2 p-2 flex justify-between">
    <span>No.</span>
    <span>Title</span>
    <span>Status</span>
    <span>Action</span>
 </div>


 <ul>
  {todos.map(todo => (
    <li key={todo.id} className="bg-amber-100 mt-2 px-2 py-1 flex justify-between">

      {editingId === todo.id ? (

        < div className="flex gap-2 ">
          <span className="bg-white p-1 rounded-full">{todo.id}</span>
          <input
            value={editTitle}
            onChange={(e)=>setEditTitle(e.target.value)}
            className="border-2 bg-white rounded-md"
            maxLength={30}
          />

          <button className="bg-green-500 px-2 py-1 rounded-md text-white" onClick={()=>updateTodo(todo.id)}>
            Save
          </button>
        </div>

      ) : (

        <>

          <div className="flex gap-2">
            <input
  type="checkbox"
  checked={todo.completed}
  onChange={() => toggleTodo(todo)}
/>

<span className="p-1 bg-white rounded-full">{todo.id}</span>


<span>{todo.title}</span>

<span className={todo.completed ? "text-green-600" : "text-red-500"}>
  {todo.completed ? "Completed" : "Pending"}
</span>
            </div> 
         
          
          <div className="flex gap-1">
            <button
            onClick={()=>{
              setEditingId(todo.id);
              setEditTitle(todo.title);
            }}
            className="bg-blue-500 py-1 px-2 rounded-md text-white"
          >
            Edit
          </button>

          <button className="bg-red-500 px-2 py-1 rounded-md text-white" onClick={()=>deleteTodo(todo.id)}>
            Delete
          </button>
          </div>
          
        </>

      )}

    </li>
  ))}
</ul>

 </div>
 );
}