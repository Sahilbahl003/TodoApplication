import LoginForm from "../components/LoginForm";

export default function LoginPage(){

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white rounded-xl shadow-lg grid grid-cols-2 w-[900px]">

        {/* Left Side */}
        <div className="flex flex-col justify-center items-center bg-blue-50 p-10">

          <h2 className="text-3xl font-bold text-blue-500">
            Welcome Back
          </h2>

          <p className="text-blue-400">
            Shop Now !!
          </p>

        </div>

        {/* Right Side */}
        <div className="p-10">

          <LoginForm/>

        </div>

      </div>

    </div>

  );
}