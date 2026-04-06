"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { validateField } from "../../../lib/validation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";

export default function LoginForm(){

const router = useRouter();

const {
register,
handleSubmit,
trigger,
formState:{errors}
} = useForm({
mode:"onChange",
reValidateMode:"onBlur"
});

const [error,setError] = useState("");
const [showPassword,setShowPassword] = useState(false);

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

toast.success("Login successful");

localStorage.setItem("token",data.token);

localStorage.setItem("user", JSON.stringify({
email: data.email || formData.email,
name: data.name || formData.email.charAt(0).toUpperCase()
}));

router.push("/");

}else{

toast.error(data.message || "Login failed");

setError(data.message);

}

}

return(

<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

<h2 className="text-2xl font-bold text-blue-500">
Login
</h2>


{/* EMAIL */}

<div>

<input
type="email"
placeholder="Enter your email"
className="w-full border p-3 rounded-lg"
{...register("email",{
validate:(value)=> validateField("email",value) || true
})}
onBlur={()=>trigger("email")}
/>

{errors.email && (
<p className="text-red-500 text-xs mt-1">
{errors.email.message || errors.email}
</p>
)}

</div>


{/* PASSWORD */}

<div className="relative">

<input
type={showPassword ? "text" : "password"}
placeholder="Enter password"
className="w-full border p-3 rounded-lg pr-10"
{...register("password",{
validate:(value)=> validateField("password",value) || true
})}
onBlur={()=>trigger("password")}
/>

{/* Eye Toggle */}

<div
className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? (
<AiOutlineEyeInvisible className="text-gray-500 text-lg"/>
) : (
<AiOutlineEye className="text-gray-500 text-lg"/>
)}
</div>

{errors.password && (
<p className="text-red-500 text-xs mt-1">
{errors.password.message || errors.password}
</p>
)}

</div>


{/* <p className="text-red-500 text-sm">
{error}
</p> */}


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