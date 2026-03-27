"use client"
import { useState } from "react";
import { useRouter } from "next/navigation"
export default function TodoForm({todo}){
const router = useRouter()
const [title,setTitle] = useState(todo?.title || "");
const [date,setDate] = useState(todo?.todo_date?.split("T")[0] || "")
const [error,setError] = useState("")
const isEdit = !!todo
async function handleSubmit(e){
e.preventDefault()
const url = isEdit ? `/api/todos/${todo.id}` : "/api/todos"
const method = isEdit ? "PUT" : "POST"
const res = await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify({title,todo_date:date,completed:todo?.completed || false})})
const data = await res.json()
if(!res.ok){setError(data.message)
     return}
router.push("/")
router.refresh()
}
return(
<div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-blue-50 p-10">
<h2 className="text-xl text-blue-600 font-semibold mb-4">{isEdit ? "Edit Todo" : "Add New Todo"}</h2>
<form onSubmit={handleSubmit} className="flex flex-col gap-3">
<input value={title}onChange={(e)=>setTitle(e.target.value)}placeholder="Task Name"className="border p-2 rounded bg-white"/>
<input type="date" min={new Date().toISOString().split("T")[0]} value={date}onChange={(e)=>setDate(e.target.value)}className="border p-2 rounded bg-white"/>
{error && <p className="text-red-500 text-sm">{error}</p>}
<button className="bg-blue-600 text-white py-2 rounded">{isEdit ? "Update" : "Add"}</button>
</form>
</div>
)
} 
