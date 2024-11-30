import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { TransactionContext } from "../context/TransactionContext";

const DashBoard = () => {
  const [account, setAccount] = useState(null);
  const [randomId, setRandomId] = useState(null);
  const [amount, setAmount] = useState("1000");
  const [recipientAccount, setRecipientAccount] = useState("123456789-");
  const [ifscCode, setIfscCode] = useState("IBKL45678");
  const [name, setName] = useState("CUSTOMERNAME");
  const [message, setMessage] = useState("MESSAGE");
  const [tableData, setTableData] = useState([]); // To store API response
  const [error, setError] = useState(""); // For any error messages

  const {
    currentAccount,
    handleChange,
    sendTransaction,
    sendTokens,
    payment,
    formData,
    isLoading,
  } = useContext(TransactionContext);

  useEffect(() => {
    const fetchAccountDetails = async () => {
        const accout = localStorage.getItem("address");
        const id = localStorage.getItem("randomId");
        setAccount(accout);
        setRandomId(id);
      
    };
    fetchAccountDetails();
  }, []);

  const handleSubmit = () => {
    sendTokens();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAccount(currentAccount);

        const response = await axios.get(
          "https://cryptowallet-2.onrender.com/api/getDetails",
          {
            params: { randomId }, // Pass randomId as query parameters
          }
        );

        setTableData(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Unable to fetch data. Please try again.");
      }
    };

    if (randomId) {
      fetchData();
    }
  }, [randomId]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
          {/* User ID and Profile */}
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-20 w-20 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-bold text-yellow-500">
                ID ClimateCrew
              </h2>
              <p className="text-sm text-gray-300">{account}</p>

              <div className="bg-gray-700 text-xs text-gray-400 px-2 py-0.5 rounded mt-1">
                ID {randomId}
              </div>
            </div>
          </div>

          {/* Personal Link */}
          <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between mb-4">
            <h3 className="text-sm">Personal link</h3>
            <a
              href="https://climatecrew.info/dashboard"
              className="text-yellow-500 text-sm hover:underline"
            >
              https://climatecrew.info/dashboard
            </a>
            <button className="ml-2 text-gray-500">📋</button>
          </div>

          {/* Token Info */}
          <div className="bg-blue-500 p-4 rounded-lg flex items-center justify-between">
            <span className="text-white text-sm">TEMZ/BNB</span>
            <span className="text-lg font-bold bg-gray-900 px-4 py-1 rounded-full">
              0.6 USD
            </span>
            <div className="bg-transparent p-2 rounded-full">
              <span className="text-3xl">🪙</span>
            </div>
          </div>
          <button
            style={{ marginTop: "20px" }}
            onClick={handleSubmit}
            className="text-lg font-bold bg-green-500 px-4 py-1 rounded-full"
          >
            Send BNB
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
