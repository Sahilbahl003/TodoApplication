"use client";
import { useEffect, useState } from "react";import { useRouter } from "next/navigation";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function TodoList({ initialTodos }) {

const router = useRouter();
const [todos, setTodos] = useState(initialTodos);

useEffect(() => {
  setTodos(initialTodos);
}, [initialTodos]);

console.log("todo in todo list",todos);
const [selectedDate, setSelectedDate] = useState("");
const [search, setSearch] = useState("");
const [activeTab, setActiveTab] = useState("active");

/* FORMAT DATE */
function formatDate(date){if(!date) return ""
const [year,month,day] = date.split("T")[0].split("-")
return `${day}/${month}/${year.slice(-2)}`}

/* DELETE */
async function deleteTodo(id)
{
  const token = localStorage.getItem("token")
  await fetch(`/api/todos/${id}`,{method:"DELETE",headers:{Authorization: `Bearer ${token}`}})
  setTodos(prev => prev.filter(t => t.id !== id));
}

/* TOGGLE */
async function toggleTodo(todo){
const token = localStorage.getItem("token")

const res = await fetch(`/api/todos/${todo.id}`,{
  method:"PUT",
  headers:{
    "Content-Type":"application/json",
    Authorization: `Bearer ${token}`
  },
  body:JSON.stringify({
    title:todo.title,
    completed:!todo.completed,
    todo_date: todo.todo_date
      ? todo.todo_date
      : null
  })
})

const updated = await res.json()
setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
}


/* UNIQUE DATES FOR DROPDOWN */
const dates = [...new Set(todos.map(t => t.todo_date?.slice(0,10)))]

/* FILTER TODOS */


const filteredTodos = todos.filter(todo => {
const rawDate = todo.todo_date
const matchDate = selectedDate ? rawDate === selectedDate : true
const matchSearch = todo.title.toLowerCase().includes(search.toLowerCase())
const matchTab =activeTab === "active"? !todo.completed: todo.completed
return matchDate && matchSearch && matchTab
})
/* GROUP BY DATE */
const groupedTodos = filteredTodos.reduce((acc,todo)=>{
const dateKey = todo.todo_date?.split("T")[0]
if(!acc[dateKey]){acc[dateKey] = []}
acc[dateKey].push(todo)
return acc
},{})
/* SORT DATES */
const sortedDates = Object.keys(groupedTodos).sort((a,b)=> new Date(a) - new Date(b))
return (
<div className="w-[1200px] p-10 rounded-xl mt-5 mx-auto p-6 bg-blue-50">
{/* TOP BAR */}
<div className="flex items-center justify-between mb-6">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">

    <select
      className="border p-2 rounded-md bg-white"
      value={selectedDate}
      onChange={(e)=>setSelectedDate(e.target.value)}
    >
      <option value="">All Dates</option>
      {dates.map(d=>(
        <option key={d} value={d}>
          {formatDate(d)}
        </option>
      ))}
    </select>

    <input
      placeholder="Search List"
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      className="border px-3 py-2 rounded-md bg-white"
    />

  </div>

  {/* RIGHT SIDE */}
  <button
  onClick={()=>{
    const token = localStorage.getItem("token")

    if(!token){
      router.push("/login")
    }else{
      router.push("/todo/new")
    }
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded-md ml-4"
>
  + Add New
</button>

</div>
{/* TABS */}
<div className="flex gap-6 mb-6">
<button onClick={()=>setActiveTab("active")}className={`pb-1 border-b-2 ${activeTab==="active"? "border-blue-600 font-semibold": "border-transparent"}`}>Active Task</button>
<button onClick={()=>setActiveTab("completed")}className={`pb-1 border-b-2 ${activeTab==="completed"? "border-green-600 font-semibold": "border-transparent"}`}>Completed</button>
</div>
{/* GROUPED TASKS */}
{sortedDates.length === 0 && (<p className="text-gray-500">No tasks found</p>)}
{sortedDates.map(dateKey => (
<div key={dateKey} className="mb-8">
{/* DATE HEADER */}
<h2 className="text-lg font-semibold mb-4">{formatDate(dateKey)}</h2>
{/* CARD GRID */}
<div className="grid md:grid-cols-3 gap-4">
{groupedTodos[dateKey].map(todo => (
<div key={todo.id}className={`p-4 rounded-xl shadow ${todo.completed? "bg-green-100": "bg-blue-100"}`}>
<div className="flex justify-between">
<div className="flex gap-2 items-center ">
<input type="checkbox"checked={todo.completed}onChange={()=>toggleTodo(todo)}/>
<span>{todo.title}</span>
</div>
<div className="flex gap-2">
<button onClick={()=>router.push(`/todo/edit/${todo.id}`)}className="bg-blue-500 p-1 rounded text-white"><MdModeEditOutline/></button>
<button onClick={()=>deleteTodo(todo.id)}className="bg-red-500 p-1 rounded text-white"><RiDeleteBin6Fill/></button>
</div>
</div>
</div>
))}
</div>
</div>
))}
</div>
)
}


