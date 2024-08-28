import { useState } from "react";
import { login } from "../services/login";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    try {
      const logins = await login(user);
      console.log(logins)
    } catch (error) {
      console.error(`error during login`);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center ">
      <div className="absolute inset-0 bg-cover bg-center filter bg-loginFond blur-sm"></div>
      <div className="relative flex flex-col justify-center items-center h-[450px] w-[380px]  bg-black bg-opacity-60 p-4 shadow-lg">
        <div className="text-white text-6xl  mb-4">Tsikilo</div>
        <form className="flex flex-col items-center w-full">
          <input
            type="text"
            placeholder="Mail"
            required
            className="w-[270px] h-[40px] mt-5 bg-transparent border-b-2 border-white text-white text-lg pl-1 focus:outline-none focus:border-red-400 transition-colors duration-500 ease-in-out"
            onChange={(e) => {
              setUser({
                ...user,
                username: e.target.value,
              });
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            required
            className="w-[270px] h-[40px] mt-5 bg-transparent border-b-2 border-white text-white text-lg pl-1 focus:outline-none focus:border-red-400 transition-colors duration-500 ease-in-out"
            onChange={(e) => {
              setUser({
                ...user,
                password: e.target.value,
              });
            }}
          />
          <button onClick={handleLogin} className="w-[280px] h-[35px] mt-10 bg-red-400 text-white text-base font-roboto rounded-sm shadow-md hover:bg-white hover:text-red-400 transition-colors duration-300 cursor-pointer">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
