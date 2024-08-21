import React, { useState } from "react";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  return (
    <div className="bg-gray h-[100vh] flex justify-center items-center ">
      <form action="">
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={user?.email}
            onChange={(e) => {
              setUser({
                ...user,
                email: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={user?.password}
            onChange={(e) => {
              setUser({
                ...user,
                password: e.target.value,
              });
            }}
          />
        </div>
        <button
          className="border p-2 rounded bg-primaryGreen text-white"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
