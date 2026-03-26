import TodoList from "./components/TodoList";

async function getTodos() {
 const res = await fetch("http://localhost:3000/api/todos");
 return res.json();
}

export default async function Page() {
 const todos = await getTodos();

 return (
 <div className="">
 <TodoList initialTodos={todos} />
 </div>
 );
}