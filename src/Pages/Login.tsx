import { useState } from "react";
import { useAuthService } from "../services/login";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginUser } = useAuthService();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState({
    mail: "",
    password: "",
    error: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const loginAnswer = await loginUser(user);
      console.log(loginAnswer);
      if (loginAnswer.type === "success") {
        navigate("/admin");
      } else if (loginAnswer.type === "unknown_user") {
        setLoginError({ ...loginError, mail: loginAnswer.message });
      } else if (loginAnswer.type === "incorrect_pass") {
        setLoginError({ ...loginError, password: loginAnswer.message });
      } else {
        setLoginError({ ...loginError, error: loginAnswer.message });
      }
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
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Mail"
              required
              className={`w-[270px] h-[40px] mt-5 bg-transparent border-b-2 text-white text-lg pl-1 focus:outline-none   ${
                loginError.mail === ""
                  ? "focus:border-primaryGreen"
                  : "border-red-500"
              } transition-colors duration-500 ease-in-out`}
              onChange={(e) => {
                setLoginError({
                  ...loginError,
                  mail: "",
                  password: "",
                  error: "",
                });
                setUser({
                  ...user,
                  username: e.target.value,
                });
              }}
            />
            <span
              className={`mt-1 text-red-500 text-sm ${
                loginError.mail === "" ? "hidden" : ""
              }`}
            >
              {loginError.mail}
            </span>
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Mot de passe"
              required
              className={`w-[270px] h-[40px] mt-5 bg-transparent border-b-2  text-white text-lg pl-1 focus:outline-none ${
                loginError.password === ""
                  ? "focus:border-primaryGreen"
                  : "border-red-500"
              } transition-colors duration-500 ease-in-out`}
              onChange={(e) => {
                setLoginError({
                  ...loginError,
                  mail: "",
                  password: "",
                  error: "",
                });
                setUser({
                  ...user,
                  password: e.target.value,
                });
              }}
            />
            <span
              className={`mt-1 text-red-500 text-sm ${
                loginError.password === "" ? "hidden" : ""
              }`}
            >
              {loginError.password}
            </span>
          </div>
          <button
            onClick={handleLogin}
            className="w-[280px] h-[35px] mt-10 bg-red-400 text-white text-base font-roboto rounded-sm shadow-md hover:bg-white hover:text-red-400 transition-colors duration-300 cursor-pointer"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
