"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm(){

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const[error,setError] = useState("");

  async function handleSubmit(e){

    e.preventDefault();

    const res = await fetch("/api/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,email,password})
    });

    const data = await res.json();
   
    if(res.ok){
      router.push("/login");
    }
    else{
      console.log("Registration failed", res);
      //const data = await res.json();
 setError(data.message || "Registration failed");
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

       {/* <p className="text-red-500 text-sm">
        {error}
      </p> */}

      <input
      type="password"
      placeholder="Password"
      className="w-full border p-3 rounded-lg"
      onChange={(e)=>setPassword(e.target.value)}
      required
      />

      <button
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 cursor-pointer"
      >
      Create Account
      </button>

      <p className="text-sm text-center">
        Have an account? 
        <span
        onClick={()=>router.push("/login")}
        className="text-blue-500 cursor-pointer ml-1"
        >
        Login
        </span>
      </p>

      <p className="text-red-500 text-sm ">
        {error}
      </p>

    </form>

  )
}