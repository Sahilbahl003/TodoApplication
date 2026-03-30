"use client"

//import TodoList from "./components/TodoList";
import { useEffect,useState } from "react";
import TodoList from "../components/TodoList";

export default function Page(){

const [todos,setTodos] = useState([])


console.log("todos in page.js after use state",todos);

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
console.log("todos in page.js after fetch",data)

setTodos(Array.isArray(data) ? data : [])
}

getTodos()

},[])

return <TodoList initialTodos={todos}/>

}

//inside todo list i got empty array thats why i havent get todo in hope page 