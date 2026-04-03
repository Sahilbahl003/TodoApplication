"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// import QuillEditor from "./QuillEditor";

const QuillEditor=dynamic(()=>
import("./QuillEditor"),{
  ssr:false,
})

export default function TodoForm({todo}){

const router = useRouter()

const [title,setTitle] = useState(todo?.title || "")
const [description,setDescription] = useState(todo?.description || "")

const [labels,setLabels] = useState([])
const [selectedLabels,setSelectedLabels] = useState([])

const [date,setDate] = useState(
  todo?.todo_date
    ? todo.todo_date
    : ""
)

const [error,setError] = useState("")
const isEdit = !!todo;

useEffect(()=>{

const token = localStorage.getItem("token")

fetch("/api/labels",{
 headers:{Authorization:`Bearer ${token}`}
})
.then(res=>res.json())
.then(setLabels)

},[])


async function handleSubmit(e){
  e.preventDefault()

  const token = localStorage.getItem("token")

  const url = isEdit ? `/api/todos/${todo.id}` : "/api/todos"
  const method = isEdit ? "PUT" : "POST"

  const safeDate = date || null

  const res = await fetch(url,{
    method,
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      description,
      todo_date:safeDate,
      completed: todo?.completed || false
    })
  })

  const data = await res.json()

if(!res.ok){
  setError(data.message)
  return
}



if(selectedLabels.length > 0){

await fetch(`/api/todos/${data.id}/labels`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
labelIds:selectedLabels
})
})

}


  router.push("/")
  router.refresh()
}

useEffect(()=>{
  const token = localStorage.getItem("token")

  if(!token){
    router.push("/login")
  }
},[])

return(

<div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-blue-50 p-10">

<h2 className="text-xl text-blue-600 font-semibold mb-4">
{isEdit ? "Edit Todo" : "Add New Todo"}
</h2>

<form onSubmit={handleSubmit} className="flex flex-col gap-3">

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
placeholder="Task Name"
className="border p-2 rounded bg-white"
/>

<p>Description:</p>
<QuillEditor
value={description}
setValue={setDescription}
/>

<div>

<p className="mt-3">Select Labels:</p>

<div className="flex gap-2 flex-wrap mt-2">

{labels.map(label=>(

<button
key={label.id}
type="button"
onClick={()=>{

setSelectedLabels(prev=>

prev.includes(label.id)
? prev.filter(id=>id!==label.id)
: [...prev,label.id]

)

}}
className={`px-2 py-1 rounded text-sm ${
selectedLabels.includes(label.id)
? "bg-blue-600 text-white"
: "bg-gray-200"
}`}
>

{label.name}

</button>

))}

</div>

</div>



<input
type="date"
min={new Date(Date.now() - new Date().getTimezoneOffset()*60000)
  .toISOString()
  .split("T")[0]}
value={date}
onChange={(e)=>setDate(e.target.value)}
className="border p-2 rounded bg-white"
/>

{error && <p className="text-red-500 text-sm">{error}</p>}

<button className="bg-blue-600 text-white py-2 rounded cursor-pointer">
{isEdit ? "Update" : "Add"}
</button>

</form>

</div>

)

}