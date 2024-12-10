import React from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const navigate = useNavigate()
  return (
    <div className="w-full md:px-20 px-4 cursor-pointer py-4 md:py-10 absolute top-0 flex  justify-between">
      <img onClick={()=>{navigate("/")}} src={assets.logo} alt="logo" />
      <button 
      onClick={()=> navigate("/login")}
      className="border flex items-center gap-3 font-bold px-4 md:px-8 rounded-full hover:bg-blue-800 hover:duration-300 hover:text-white hover:border-x-white">Login
        <img src={assets.arrow_icon} alt="" />
      </button>
    </div>
  );
};

export default Navbar;
