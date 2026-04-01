"use client"

import { useEffect, useState } from "react";
import TodoList from "../components/TodoList";
import Sidebar from "../components/Sidebar";

export default function Page({ selectedDate }) {

const [todos,setTodos] = useState([])
const [search,setSearch] = useState("")

useEffect(()=>{

async function getTodos(){

const token = localStorage.getItem("token")

if(!token){
setTodos([])
return
}

const res = await fetch("/api/todos",{
headers:{Authorization: `Bearer ${token}`}
})

const data = await res.json()

setTodos(Array.isArray(data) ? data : [])

}

getTodos()

},[])

return (

<div className="flex">

<Sidebar
initialTodos={todos}
calendarDate={selectedDate}
search={search}
setSearch={setSearch}
/>

<div className="ml-10 w-full">

<TodoList
initialTodos={todos}
calendarDate={selectedDate}
search={search}
setSearch={setSearch}
/>

</div>

</div>

)
}

