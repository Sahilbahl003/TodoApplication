"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useDate } from "@/context/DateContext"
import Link from "next/link";

export default function TodoList({ initialTodos, calendarDate, search, setSearch })
 {

const router = useRouter();
const [todos, setTodos] = useState(initialTodos);
const { selectedDate } = useDate();

useEffect(() => {
  setTodos(initialTodos);
}, [initialTodos]);

console.log("todo in todo list",todos);
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

const matchCalendar = calendarDate
  ? rawDate?.split("T")[0] === calendarDate
  : true

const matchDate = selectedDate
  ? rawDate?.slice(0,10) === selectedDate
  : true

const matchTitle = todo.title.toLowerCase().includes(search.toLowerCase())

const matchLabel = todo.labels?.some(label =>
  label.name.toLowerCase().includes(search.toLowerCase())
)

const matchSearch = matchTitle || matchLabel

const matchTab = activeTab === "active"
  ? !todo.completed
  : todo.completed

return matchDate && matchCalendar && matchSearch && matchTab

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
<div className="w-full p-10 rounded-xl mx-auto p-6 bg-blue-50">

{/* TOP BAR */}
<div className="flex items-center justify-between mb-6">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">

    
  </div>

  
</div>
{/* TABS */}

<div className="flex justify-between">

<div className="flex gap-6 mb-4">
<button onClick={()=>setActiveTab("active")}className={`pb-1 cursor-pointer border-b-2 ${activeTab==="active"? "border-blue-600 font-semibold": "border-transparent"}`}>Active Task</button>
<button onClick={()=>setActiveTab("completed")}className={`pb-1 cursor-pointer border-b-2 ${activeTab==="completed"? "border-green-600 font-semibold": "border-transparent"}`}>Completed</button>
</div>

<button
  onClick={()=>{
    const token = localStorage.getItem("token")

    if(!token){
      router.push("/login")
    }else{
      router.push("/todo/new")
    }
  }}
  className="bg-blue-600 text-white px-4 rounded-md ml-4 cursor-pointer"
>
  + Add New
</button>

</div>


{/* GROUPED TASKS */}
{sortedDates.length === 0 && (<p className="text-gray-500">No tasks found</p>)}
{sortedDates.map(dateKey => (
<div key={dateKey} className="mb-8">
{/* DATE HEADER */}
{/* <h2 className="text-lg font-semibold mb-4">{formatDate(dateKey)}</h2> */}

{/* CARD GRID */}

<div className="grid md:grid-cols-3 gap-4 mt-2">
{groupedTodos[dateKey].map(todo => (
<div key={todo.id}className={`p-4 rounded-xl shadow ${todo.completed? "bg-green-100": "bg-blue-100"}`}>
<div className="flex justify-between">
<div className="flex gap-2 items-center cursor-pointer">
<input className="cursor-pointer" type="checkbox" checked={todo.completed} onChange={()=>toggleTodo(todo)}/>
<div className="flex flex-col">
  <p className="text-xs text-zinc-400 italic">{formatDate(dateKey)}</p>
<Link href={`/todos/${todo.id}`} className="text-blue-600 hover:underline">
  <span>{todo.title}</span>
</Link>

<div className="flex gap-2 flex-wrap mt-2">

{todo.labels?.map(label=>(
<span
key={label.id}
className="bg-purple-200 text-xs px-2 py-1 rounded"
>
{label.name}
</span>
))}

</div>


</div>

</div>
<div className="flex gap-2">
{/* <button onClick={()=>router.push(`/todo/edit/${todo.id}`)}className="bg-blue-500 p-1 cursor-pointer rounded text-white"><MdModeEditOutline/></button> */}
<button onClick={()=>deleteTodo(todo.id)}className="text-red-600 p-1 cursor-pointer rounded text-white"><RiDeleteBin6Fill className="text-red-500 text-xl"/></button>
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


