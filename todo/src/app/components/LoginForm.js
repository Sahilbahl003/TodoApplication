"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  async function handleSubmit(e){

    e.preventDefault();

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    });

    const data = await res.json();

    if(res.ok){

    
      localStorage.setItem("token",data.token);

      
      localStorage.setItem("user", JSON.stringify({
        email: data.email || email,
        name: data.name || email.charAt(0).toUpperCase()
      }));

      router.push("/");

    }else{
      setError(data.message);
    }
  }

  return(

    <form onSubmit={handleSubmit} className="space-y-5">

      <h2 className="text-2xl font-bold text-blue-500 ">
        Login
      </h2>

      <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      className="w-full border p-3 rounded-lg"
      required
      />

      

      <input
      type="password"
      placeholder="Enter password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      className="w-full border p-3 rounded-lg"
      required
      />

      

       <p className="text-red-500 text-sm ">
        {error}
      </p>

      <button
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 cursor-pointer"
      >
      Login
      </button>

      <p className="text-sm text-center">
        New user? 
        <span
        onClick={()=>router.push("/register")}
        className="text-blue-500 cursor-pointer ml-1"
        >
        Create account
        </span>
      </p>

     

    </form>

  )
}