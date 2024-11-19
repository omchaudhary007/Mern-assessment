import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../App";
import { useNavigate } from "react-router-dom";
import { post } from "../api/api";

const inputStyle = "w-full my-3 border-b-2 border-green-800 outline-none";
const labelText = "font-medium whitespace-nowrap";

const Login = () => {
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const options = {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      };
      const result = await post("/admin/login", options);
      if(!result.success){
        toast.error(result.message);
      }
      else{
        toast.success("Login sucessful!");
        setUsername(userName);
        navigate('/');
      }
    } catch (error) {
      toast.error("Something went Wrong!");
    }finally{
      setLoading(false);
    }
  };

  const { setUsername } = useUser();
  const navigate = useNavigate();
  const [userName, setnameState] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <img className="w-10 h-10 mx-10 my-3" src="./vite.svg" alt="logo" />
      <div
        className={`md:w-1/3 w-2/3 mx-auto p-6 bg-white rounded-md ${
          isLoading ? "opacity-60" : "opacity-100"
        }`}
      >
        <h3 className="text-3xl font-semibold mb-10 text-violet-950">
          Sign in
        </h3>
        <form
          name="loginForm"
          method="post"
          disabled={isLoading}
          onSubmit={handleSubmit}
        >
          <label className={labelText} htmlFor="userName">
            Enter your Username :
          </label>
          <input
            name="userName"
            className={inputStyle}
            type="text"
            required
            onChange={(e) => setnameState(e.target.value)}
          />
          <label className={labelText} htmlFor="password">
            Enter your Password :
          </label>
          <input
            name="password"
            className={inputStyle}
            type="text"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full px-2 py-1 mt-2 rounded-full text-lg text-white font-medium bg-orange-500 active:bg-orange-600">
            Login
          </button>
        </form>
        <div className="my-4 text-center">
          <span className="whitespace-nowrap">Don't have an account ?</span>
          <button className="mx-2 whitespace-nowrap underline text-red-600 font-semibold active:opacity-80">
            Sign Up now
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
