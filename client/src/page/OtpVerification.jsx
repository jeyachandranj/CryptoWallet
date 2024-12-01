import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLessThan } from "react-icons/fa";

const OtpVerification = () => {
  const [formData, setFormData] = useState({
    paymentMethod: "",
    name: "",
    email: "",
    mobileNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Referalid = localStorage.getItem("ReferalId");
    let randomId = localStorage.getItem("randomId");
    const address = localStorage.getItem("address");
    localStorage.setItem("method", formData.paymentMethod);
    if (formData.paymentMethod === "binary") {
      randomId = randomId;
    } else if (formData.paymentMethod === "matrix") {
      randomId = `m_${randomId}`;
    }
    const finalFormData = {
      ...formData,
      Referalid, // Add the ReferalId from localStorage
      randomId,
      address,
    };
    axios
      .post("https://cryptowallet-2.onrender.com/api/register", finalFormData)
      .then((response) => {
        console.log(response.data);
        alert("Registration successful!");
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert("Mobile number already exists!");
        } else {
          console.error("There was an error submitting the form!", error);
          alert("There was an error submitting the form. Please try again.");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-transactions px-4">
      <div className="white-glassmorphism p-12 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-white-800 mb-8">
          Email Verification
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex item-center justify-center">
            {/* Left Column */}
            <div>
              {/* Dropdown for Payment Method */}
              

              {/* Mobile Number */}
              <div className="item-center">
                <label
                  className="block text-white-700 font-semibold mb-2"
                  htmlFor="mobileNumber"
                >
                  Otp Code *
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your OTP"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Email */}
            </div>

            {/* Right Column */}
          
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

export default OtpVerification;
