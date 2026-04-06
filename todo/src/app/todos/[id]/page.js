"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdModeEditOutline } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import "quill/dist/quill.snow.css"

export default function TodoDetail(){

const { id } = useParams()
const router = useRouter()

const [todo,setTodo] = useState(null)

const [subtasks,setSubtasks] = useState([])
const [newSubtask,setNewSubtask] = useState("") 

useEffect(()=>{

async function getTodo(){

const token = localStorage.getItem("token")



const res = await fetch(`/api/todos/${id}`,{
headers:{
Authorization:`Bearer ${token}`
}
})

const data = await res.json()
setTodo(data)

}

if(id) getTodo()

async function getSubtasks(){
const token = localStorage.getItem("token")
const res = await fetch(`/api/todos/${id}/subtasks`,{headers:{Authorization:`Bearer ${token}`}})
const data = await res.json()
setSubtasks(data)
}
getSubtasks()    

},[id])

async function addSubtask(){
if(!newSubtask.trim()) return
const token = localStorage.getItem("token")
const res = await fetch(`/api/todos/${id}/subtasks`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({title:newSubtask})})
const data = await res.json()
setSubtasks(prev=>[...prev,data])
setNewSubtask("")
}

async function toggleSubtask(id,completed){

const token = localStorage.getItem("token")

await fetch(`/api/subtasks/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({completed:!completed})
})

setSubtasks(prev =>
prev.map(s =>
s.id === id ? {...s,completed:!completed} : s
)
)

}

if(!todo){
return <p>Loading...</p>
}

return(
<div className="">
    <div className="flex items-center gap-4 mb-6">
        <button onClick={()=>router.push("/")} className="text-3xl cursor-pointer">
              <IoIosArrowBack />
        </button>
         <h1 className="text-2xl font-bold w-full text-center">Todo Detail</h1>
    </div>
   
    <div className="max-w-2xl mx-auto mt-10 border p-6 rounded">

<div className="flex items-center gap-2">

<div className="flex w-full justify-between">
 <h1 className="text-2xl font-bold mb-4">
{todo.title}
</h1>

<button
onClick={()=>router.push(`/todo/edit/${todo.id}`)}
className="bg-blue-500 px-3 py-1 text-2xl cursor-pointer rounded text-white"
>
<MdModeEditOutline/>
</button>
</div>



</div>

<div
className="ql-editor [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold"
dangerouslySetInnerHTML={{__html: todo.description}}
/>

<div className="mt-6">
<h2 className="font-semibold mb-2">Subtasks</h2>
<div className="flex gap-2 mb-4">
<input value={newSubtask}onChange={(e)=>setNewSubtask(e.target.value)}placeholder="Add subtask"className="border p-2 rounded w-full"/>
<button onClick={addSubtask}className="bg-blue-500 text-white px-3 rounded">Add</button>
</div>

{subtasks.map(sub=>(<div key={sub.id} className="flex items-center gap-2 mb-2">
<input
type="checkbox"
checked={sub.completed}
onChange={()=>toggleSubtask(sub.id,sub.completed)}
/>
<span className={sub.completed?`text-zinc-500 p-1 rounded-md line-through decoration-2`:`p-1 rounded-md`}>{sub.title}</span>
</div>))}
</div>


</div>


</div>   



)

}