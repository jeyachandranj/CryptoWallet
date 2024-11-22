import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [formData, setFormData] = useState({
    walletId:"01",
    walletaddress: "",
    binary: "",
    matrix: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://ec2-13-126-194-20.ap-south-1.compute.amazonaws.com:5000/submit",
        formData
      );
      console.log(formData)
      console.log(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form data:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-transactions px-4">
      <div className="white-glassmorphism p-12 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-white-800 mb-8">
          Admin Management
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Wallet Address */}
          <div className="mb-6">
            <label className="block text-white-700 font-semibold mb-2" htmlFor="walletaddress">
              Wallet Address
            </label>
            <input
              type="text"
              id="walletaddress"
              name="walletaddress"
              value={formData.walletaddress}
              onChange={handleChange}
              placeholder="Enter your wallet address"
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Binary Value */}
          <div className="mb-6">
            <label className="block text-white-700 font-semibold mb-2" htmlFor="binary">
              Binary Value
            </label>
            <input
              type="text"
              id="binary"
              name="binary"
              value={formData.binary}
              onChange={handleChange}
              placeholder="Enter your binary value"
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Matrix Value (Email) */}
          <div className="mb-6">
            <label className="block text-white-700 font-semibold mb-2" htmlFor="matrix">
              Matrix Value (Email)
            </label>
            <input
              type="text"
              id="matrix"
              name="matrix"
              value={formData.matrix}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
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

export default Admin;
