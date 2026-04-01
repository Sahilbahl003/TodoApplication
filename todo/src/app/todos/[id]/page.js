"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdModeEditOutline } from "react-icons/md";
import "quill/dist/quill.snow.css"

export default function TodoDetail(){

const { id } = useParams()
const router = useRouter()

const [todo,setTodo] = useState(null)

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

},[id])

if(!todo){
return <p>Loading...</p>
}

return(
<div className="">
    <h1 className="text-2xl font-bold w-full text-center">Todo Detail</h1>
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

</div>
</div>   



)

}