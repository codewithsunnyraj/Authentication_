import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-full flex justify-center flex-col items-center min-h-screen md:pt-28 pt-20 px-4 md:px-6 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-4 md:mb-6">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center pb-4">
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login to your Acccount!"}
        </p>

        <form>
          <div
            className={`${
              state === "Sign Up"
                ? "flex items-center gap-3 py-2 px-6 bg-black rounded-full"
                : "hidden"
            }`}
          >
            <img src={assets.person_icon} alt="" className="" />
            <input
              type="text"
              onChange={(event) => {
                setName(event.target.value);
              }}
              value={name}
              required
              placeholder="Full Name"
              className="p-1 bg-transparent outline-none text-white"
            />
          </div>
          <div className="flex items-center my-3 gap-3 py-2 px-6 bg-black rounded-full">
            <img src={assets.mail_icon} alt="" className="" />
            <input
              type="email"
              required
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              placeholder="Email Id"
              className="p-1 bg-transparent outline-none text-white"
            />
          </div>
          <div className="flex items-center gap-3 py-2 px-6 bg-black rounded-full">
            <img src={assets.lock_icon} alt="" className="" />
            <input
              type="password"
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              value={password}
              placeholder="Enter Password "
              className="p-1 bg-transparent outline-none text-white"
            />
          </div>
          <p className="my-2 text-center text-indigo-300 cursor-pointer"
          onClick={()=>{navigate("/reset-password")}}
          >
            Forget Password?
          </p>
          <button className="w-full mt-2 py-2 rounded-full bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-500">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <div className="flex gap-2 justify-center mt-3">
            <p>Already have an account ?</p>
            <span
              onClick={() => {
                setState("Login");
              }}
              className="cursor-pointer underline"
            >
              Login here
            </span>
          </div>
        ) : (
          <div className="flex gap-2 justify-center mt-2">
            <p>Don't have an account ?</p>
            <span
              onClick={() => {
                setState("Sign Up");
              }}
              className="cursor-pointer underline"
            >
              Sign Up
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
