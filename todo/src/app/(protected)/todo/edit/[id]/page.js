"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"   
import TodoForm from "@/app/components/TodoForm"

export default function Page() {

  const params = useParams();      
  const id = params?.id;            

  const [todo, setTodo] = useState(null);

  useEffect(() => {

    if (!id) return;          
    async function getTodo() {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setTodo(data);
    }

    getTodo();

  }, [id]);                        

  if (!todo) return null;

  return <TodoForm todo={todo} />;
}