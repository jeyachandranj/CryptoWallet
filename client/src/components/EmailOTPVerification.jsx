import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EmailOTPVerification() {
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(null);
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();

  const sendOtpToEmail = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setSentOtp(data.otp); // Store OTP temporarily (for testing, replace this in prod)
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === sentOtp) {
      alert("OTP verified successfully!");
      navigate("/dashboard"); // Navigate to the next page
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-transactions px-4">
      <div className="white-glassmorphism p-12 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-white-800 mb-8">
          Verify Email
        </h2>
        <p>{email}</p>
        <form onSubmit={handleOtpSubmit}>
          <div className="flex md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="mb-6 w-full flex items-center">
              <label
                className="block text-white-700 font-semibold mb-2 mr-4"
                htmlFor="otp"
              >
                Otp *
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter your Otp"
                className="w-2/3 px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={sendOtpToEmail}
                className="bg-[#2952e3] py-2 px-6 ml-4 rounded-lg cursor-pointer hover:bg-[#2546bd] text-white"
              >
                Send Otp
              </button>
            </div>
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
}

export default EmailOTPVerification;
