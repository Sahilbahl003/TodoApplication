"use client"

import { useDate } from "@/context/DateContext"
import CalendarBox from "./CalenderBox"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ initialTodos = [], calendarDate, search, setSearch }) {

const { setSelectedDate } = useDate();
const router = useRouter();
const [labels,setLabels] = useState([])
const [showModal,setShowModal] = useState(false)
const [newLabel,setNewLabel] = useState("");
const [labelError,setLabelError] = useState("");


const [todos, setTodos] = useState(initialTodos || []);

useEffect(() => {
  setTodos(initialTodos || []);
}, [initialTodos]);

useEffect(()=>{

const token = localStorage.getItem("token")

if(!token)
{
  return router.push("/")
}


fetch("/api/labels",{
 headers:{Authorization:`Bearer ${token}`}
}).then(res=>res.json()).then(setLabels)

},[])


console.log("todo in sidebar", todos);

/* FORMAT DATE */
function formatDate(date){
if(!date) return ""
const [year,month,day] = date.split("T")[0].split("-")
return `${day}/${month}/${year.slice(-2)}`
}

/* DELETE */
async function deleteTodo(id)
{
const token = localStorage.getItem("token")

await fetch(`/api/todos/${id}`,{
method:"DELETE",
headers:{Authorization: `Bearer ${token}`}
})

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
todo_date: todo.todo_date ? todo.todo_date : null
})
})

const updated = await res.json()

setTodos(prev =>
prev.map(t => t.id === updated.id ? updated : t)
)

}

/* DATE CHANGE FROM CALENDAR */

function handleDateChange(date){

if(!date){
setSelectedDate("")
return
}

const formatted = date.toLocaleDateString("en-CA")

setSelectedDate(formatted)

}

return (

<div className="w-72 fixed left-0 top-0 h-screen bg-blue-500 text-white p-4 z-50">

{/* LOGO + TITLE */}

<div className="flex gap-3 items-center">

<Link href="/">
<Image
src="/image.png"
alt="Logo"
width={35}
height={20}
className="rounded-full w-10 h-10"
/>
</Link>

<h1 className="text-2xl font-bold">
Task Manager
</h1>

</div>

<hr className="border-b-2 bg-white mt-4"/>

{/* SEARCH */}

<div className="space-y-3 mb-8 mt-4">

<input
placeholder="Search List"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-3 py-2 rounded-md bg-white text-black w-full"
/>

<button
onClick={()=>setSelectedDate("")}
className="block w-full text-left bg-blue-600 hover:bg-blue-700 cursor-pointer p-2 rounded"
>
All Tasks
</button>

</div>

{/* CALENDAR */}

<CalendarBox 
onDateChange={handleDateChange}/>

<div className="mt-6">

<div className="flex justify-between items-center">

<h2 className="font-semibold">Labels</h2>

<button
onClick={()=>setShowModal(true)}
className="bg-white text-black px-2 rounded"
>
+
</button>

</div>

<div className="mt-3 space-y-2">

{labels.map(label=>(
<div
key={label.id}
className="bg-blue-600 p-2 rounded text-sm"
>
{label.name}
</div>
))}

</div>

</div>

{showModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-4 rounded text-black">

<input value={newLabel} onChange={(e)=>{setNewLabel(e.target.value); setLabelError("")}} placeholder="Label name" className="border p-2"/>
{labelError && (<p className="text-red-500 text-sm mt-1">{labelError}</p>)}

<button onClick={async()=>{
if(!newLabel.trim())
{setLabelError("Label is required");return}
setLabelError("")
const token = localStorage.getItem("token")
const res = await fetch("/api/labels",{method:"POST",
headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
body:JSON.stringify({name:newLabel})})
const data = await res.json()
setLabels(prev=>[...prev,data])
setShowModal(false)
setNewLabel("")}}
className="bg-blue-600 text-white px-3 py-1 ml-2 rounded">Add</button> 

</div>

</div>

)}




</div>



)

}