import RegisterForm from "../components/RegisterForm";

export default function RegisterPage(){

  return(

    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-10 rounded-xl shadow-lg w-[400px]">

        <RegisterForm/>

      </div>

    </div>

  )
}