import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLessThan } from "react-icons/fa";

const RegistrationForm = () => {
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
    const Referalid = localStorage.getItem('ReferalId');
    let randomId = localStorage.getItem("randomId")
    const address = localStorage.getItem("address");
    localStorage.setItem("method",formData.paymentMethod);
    if (formData.paymentMethod === 'binary') {
      randomId = randomId;
    } else if (formData.paymentMethod === 'matrix') {
      randomId = `m_${randomId}`;
    }
    const finalFormData = {
      ...formData,
      Referalid, // Add the ReferalId from localStorage
      randomId,
      address
    };
    axios.post('http://ec2-13-126-194-20.ap-south-1.compute.amazonaws.com:4000/api/register', finalFormData)
      .then(response => {
        console.log(response.data);
        alert("Registration successful!");
        navigate('/dashboard');
      })
      .catch(error => {
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
          User Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Dropdown for Payment Method */}
              <div className="mb-6">
                <label className="block text-white-700 font-semibold mb-2" htmlFor="name">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Mobile Number */}
              <div className="mb-6">
                <label className="block text-white-700 font-semibold mb-2" htmlFor="mobileNumber">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Email */}
             
             
            </div>

            {/* Right Column */}
            <div>

            <div className="mb-6">
                <label className="block text-white-700 font-semibold mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-white-700 font-semibold mb-2" htmlFor="paymentMethod">
                  Select Method *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Choose method</option>
                  <option value="binary">X2 Program</option>
                  <option value="matrix">X3 Program</option>
                </select>
              </div>

              {/* Account Holder Name */}
              {/* <div className="mb-6">
                <label className="block text-white-700 font-semibold mb-2" htmlFor="accountHolderName">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your account holder name"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Linked Mobile Number */}
              {/* <div className="mb-6">
                <label className="block text-white-700 font-semibold mb-2" htmlFor="linkedMobileNumber">
                  Linked Mobile Number *
                </label>
                <input
                  type="text"
                  id="linkedMobileNumber"
                  name="linkedMobileNumber"
                  value={formData.linkedMobileNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your linked mobile number"
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div> */} 
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
};

export default RegistrationForm;
