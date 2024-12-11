import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
const Header = () => {
  const {userData} = useContext(AppContent)
  return (
    <div className="w-full md:pt-28 pt-20 px-4 md:px-6">
      <div className="flex items-center justify-center flex-col">
        <div>
          <img src={assets.header_img} className="md:w-40 w-32 rounded-full" alt="" />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="md:text-3xl text-xl font-bold">Hey {userData ? userData.name : "Developer"}!  </h1>
          <img src={assets.hand_wave} alt="" className=" md:w-10 w-8" />
        </div>
        <div>
          <h1 className="py-4 md:py-6 md:text-4xl font-extrabold text-2xl">
            Welcome to Our App
          </h1>
        </div>
        <div>
          <p className="px-4 md:px-6 text-center">
            Let's start with a quick product tout and we will have you and
            running in no time!
          </p>
        </div>
        <div>
            <button className="my-4 md:my-5 border py-2 px-6 rounded-full font-bold hover:bg-red-800 hover:duration-300 hover:border-yellow-500 transition-all hover:text-white ">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
