"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm(){

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function handleSubmit(e){

    e.preventDefault();

    const res = await fetch("/api/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,email,password})
    });

    if(res.ok){
      router.push("/login");
    }

  }

  return(

    <form onSubmit={handleSubmit} className="space-y-5">

      <h2 className="text-2xl font-bold text-blue-500">
        Register
      </h2>

      <input
      type="text"
      placeholder="Name"
      className="w-full border p-3 rounded-lg"
      onChange={(e)=>setName(e.target.value)}
      required
      />

      <input
      type="email"
      placeholder="Email"
      className="w-full border p-3 rounded-lg"
      onChange={(e)=>setEmail(e.target.value)}
      required
      />

      <input
      type="password"
      placeholder="Password"
      className="w-full border p-3 rounded-lg"
      onChange={(e)=>setPassword(e.target.value)}
      required
      />

      <button
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
      >
      Create Account
      </button>

    </form>

  )
}