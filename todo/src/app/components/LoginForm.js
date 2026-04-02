"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginForm(){

const router = useRouter();
const { register, handleSubmit } = useForm();

const [error,setError] = useState("");

async function onSubmit(formData){

const res = await fetch("/api/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(formData)
});

const data = await res.json();

if(res.ok){

localStorage.setItem("token",data.token);

localStorage.setItem("user", JSON.stringify({
email: data.email || formData.email,
name: data.name || formData.email.charAt(0).toUpperCase()
}));

router.push("/");

}else{
setError(data.message);
}

}

return(

<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

<h2 className="text-2xl font-bold text-blue-500 ">
Login
</h2>

<input
type="email"
placeholder="Enter your email"
className="w-full border p-3 rounded-lg"
{...register("email", { required: true })}
/>

<input
type="password"
placeholder="Enter password"
className="w-full border p-3 rounded-lg"
{...register("password", { required: true })}
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