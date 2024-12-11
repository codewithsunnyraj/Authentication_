import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full md:px-20 px-4 cursor-pointer py-4 md:py-10 absolute top-0 flex  justify-between">
      <img
        onClick={() => {
          navigate("/");
        }}
        src={assets.logo}
        alt="logo"
      />
      {userData ? (
        <div className="bg-black font-extrabold text-white p-2 rounded-full w-12 flex justify-center items-center h-12 relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-12 w-[150px] bg-black right-[-50px] z-10 text-white rounded p-4 ">
            <ul>
              {!userData.isAccountVerified && <li onClick={sendVerificationOtp}>Verify Email</li>}

              {}
              <li className="py-3" onClick={logout}>
                LogOut
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="border flex items-center gap-3 font-bold px-4 md:px-8 rounded-full hover:bg-blue-800 hover:duration-300 hover:text-white hover:border-x-white"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
