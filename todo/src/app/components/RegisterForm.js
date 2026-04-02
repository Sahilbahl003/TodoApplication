"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterForm(){

const router = useRouter();
const { register, handleSubmit } = useForm();

const [error,setError] = useState("");

async function onSubmit(formData){

const res = await fetch("/api/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(formData)
});

const data = await res.json();

if(res.ok){
router.push("/login");
}
else{
console.log("Registration failed", res);
setError(data.message || "Registration failed");
}

}

return(

<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

<h2 className="text-2xl font-bold text-blue-500">
Register
</h2>

<input
type="text"
placeholder="Name"
className="w-full border p-3 rounded-lg"
{...register("name", { required: true })}
/>

<input
type="email"
placeholder="Email"
className="w-full border p-3 rounded-lg"
{...register("email", { required: true })}
/>

<input
type="password"
placeholder="Password"
className="w-full border p-3 rounded-lg"
{...register("password", { required: true })}
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