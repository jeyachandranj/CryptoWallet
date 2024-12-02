import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailOTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const navigate = useNavigate();

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(0, 1); // Ensure only one digit is entered
    setOtp(updatedOtp);

    // Automatically focus on the next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput && nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== otp.length) {
      alert("Please enter the complete OTP");
      return;
    }
    
    console.log(otp)
    axios
      .post("https://cryptowallet-production-6a04.up.railway.app", {
        otp: fullOtp,
      })
      .then((response) => {
        console.log(response.data);
        alert("OTP verified successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        alert("Invalid OTP. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-transactions px-4">
      <div className="white-glassmorphism p-12 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-white-800 mb-8">
          Verify Email
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6 space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="mobilenumber"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                maxLength="1"
                className="w-12 h-12 text-center text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-[#2952e3] py-2 px-10 mx-6 mt-10 rounded-full cursor-pointer hover:bg-[#2546bd] text-white text-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailOTPVerification;
