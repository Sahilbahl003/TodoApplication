"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateField, validateForm } from "../../../lib/validation";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function RegisterForm() {

const router = useRouter();

const [formData,setFormData] = useState({
name:"",
email:"",
password:"",
confirmPassword:""
});

const [errors,setErrors] = useState({});
const [formError,setFormError] = useState("");

const [showPassword,setShowPassword] = useState(false);
const [showConfirmPassword,setShowConfirmPassword] = useState(false);


/* ---------------- CHANGE HANDLER ---------------- */

const changeHandler = (e)=>{

const {name,value} = e.target;

const updated = {...formData,[name]:value};

setFormData(updated);

const error = validateField(name,value,updated);

let confirmError = errors.confirmPassword;

if(name==="password" || name==="confirmPassword"){

confirmError = validateField(
"confirmPassword",
updated.confirmPassword,
updated
);

}

setErrors((prev)=>({
...prev,
[name]:error,
confirmPassword:confirmError
}));

};



/* ---------------- BLUR HANDLER ---------------- */

const blurHandler = (e)=>{

const {name,value} = e.target;

const error = validateField(name,value,formData);

let confirmError = errors.confirmPassword;

if(name==="password" || name==="confirmPassword"){

confirmError = validateField(
"confirmPassword",
formData.confirmPassword,
formData
);

}

setErrors((prev)=>({
...prev,
[name]:error,
confirmPassword:confirmError
}));

};



/* ---------------- SUBMIT HANDLER ---------------- */

const submitHandler = async(e)=>{

e.preventDefault();

const validationErrors = validateForm(formData);

if(Object.keys(validationErrors).length>0){

setErrors(validationErrors);

return;

}

setFormError("");

try{

const res = await fetch("/api/register",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(formData)
});

const data = await res.json();

if(res.ok){

toast.success("User created successfully");

router.push("/login");

}else{

setFormError(data.message || "Registration failed");

}

}catch{

setFormError("Something went wrong");

}

};


return(

<form onSubmit={submitHandler} className="space-y-5">

<h2 className="text-2xl font-bold text-blue-500">
Register
</h2>


{/* NAME */}

<div>

<input
name="name"
value={formData.name}
onChange={changeHandler}
onBlur={blurHandler}
placeholder="Name"
className="w-full border p-3 rounded-lg"
/>

{errors.name && (
<p className="text-red-500 text-xs mt-1">
{errors.name}
</p>
)}

</div>



{/* EMAIL */}

<div>

<input
name="email"
value={formData.email}
onChange={changeHandler}
onBlur={blurHandler}
placeholder="Email"
className="w-full border p-3 rounded-lg"
/>

{errors.email && (
<p className="text-red-500 text-xs mt-1">
{errors.email}
</p>
)}

</div>



{/* PASSWORD */}

<div className="relative">

<input
type={showPassword ? "text" : "password"}
name="password"
value={formData.password}
onChange={changeHandler}
onBlur={blurHandler}
placeholder="Password"
className="w-full border p-3 rounded-lg pr-10"
/>

<div
className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
</div>

{errors.password && (
<p className="text-red-500 text-xs mt-1">
{errors.password}
</p>
)}

</div>



{/* CONFIRM PASSWORD */}

<div className="relative">

<input
type={showConfirmPassword ? "text" : "password"}
name="confirmPassword"
value={formData.confirmPassword}
onChange={changeHandler}
onBlur={blurHandler}
placeholder="Confirm Password"
className="w-full border p-3 rounded-lg pr-10"
/>

<div
className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
>
{showConfirmPassword ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
</div>

{errors.confirmPassword && (
<p className="text-red-500 text-xs mt-1">
{errors.confirmPassword}
</p>
)}

</div>



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


{formError && (
<p className="text-red-500 text-sm text-center">
{formError}
</p>
)}

</form>

);

}