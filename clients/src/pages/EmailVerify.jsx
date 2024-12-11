import React, { useContext,useEffect } from "react";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContent)

  const navigate = useNavigate()
  const inputRefs = React.useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const otpArray = inputRefs.current.map(e=>e.value)
      const otp = otpArray.join('')
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account',{otp})
      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate("/")
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);


  return (
    <div className="w-full flex justify-center flex-col items-center min-h-screen md:pt-28 pt-20 px-4 md:px-6 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-black text-white p-10 flex ">
        <form onSubmit={onSubmitHandler}>
          <h2 className="font-extrabold text-2xl text-center">
            Email Verify OTP
          </h2>
          <p className="text-center text-slate-400 py-3">
            Enter the 6 digit code sent to your email id
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  required
                  key={index}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => {
                    handleInput(e, index);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-3 bg-blue-700 text-white rounded-full">
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
