"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"   // ✅ IMPORTANT
import TodoForm from "@/app/components/TodoForm"

export default function Page() {

  const params = useParams();        // ✅ FIX
  const id = params?.id;             // ✅ FIX

  const [todo, setTodo] = useState(null);

  useEffect(() => {

    if (!id) return;                 // ✅ VERY IMPORTANT (prevents undefined call)

    async function getTodo() {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setTodo(data);
    }

    getTodo();

  }, [id]);                          // ✅ dependency added

  if (!todo) return null;

  return <TodoForm todo={todo} />;
}