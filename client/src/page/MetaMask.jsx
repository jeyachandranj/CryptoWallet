import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const generateRandomId = (length) => {
  const characters =
    "ABCDEFGHIJabcdefghij0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const MetaMask = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);  
  const [userBalance, setUserBalance] = useState(null);
  const [randomId, setRandomId] = useState('');
  const navigate = useNavigate();

  
  const handleGenerate = async () => {
    let isUnique = false;
    let newId;

    while (!isUnique) {
      newId = generateRandomId(10);

      try {
        const response = await fetch("https://cryptowallet-2.onrender.com/api/check-random-id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ randomId: newId, Account: defaultAccount }), 
        });
  
        const data = await response.json();

        if (!data.exists) {
          isUnique = true;
          setRandomId(newId);
          sendRandomIdToBackend(newId);  
        } else {
          console.log(data.message);  
        }
      } catch (error) {
        console.error("Error checking random ID:", error);
        break;
      }
    }
  };

  const sendRandomIdToBackend = async (id) => {
    try {
      const response = await fetch("https://cryptowallet-2.onrender.com/api/save-random-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ randomId: id, Account: defaultAccount }),  
      });

      const data = await response.json();
      if (data.success) {
        console.log("Random ID saved successfully");
      } else {
        console.error("Error saving random ID:", data.message);
      }
    } catch (error) {
      console.error("Error sending random ID to backend:", error);
    }
  };

  const connectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChanged(result[0]); 
        })
        .catch((err) => {
          setErrorMessage("Failed to connect wallet. Please try again.");
        });
    } else {
      setErrorMessage("Install MetaMask please!!");
    }
  };

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    getUserBalance(accountName);    
  };

  const getUserBalance = async (accountAddress) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accountAddress, "latest"],
      });
      const balanceInEth = ethers.utils.formatEther(balance);
      setUserBalance(balanceInEth);

      // Check if balance is sufficient
      if (Number(balance) <= ethers.utils.parseEther("5000")) {
        handleGenerate();
        navigate("/register"); 
      } else {
        alert("Insufficient balance. You need at least 5000 wei to proceed."); 
        toast("Insufficient Balance! You need 5000 wei to proceed.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch balance. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-10 w-11/12 md:w-3/4 lg:w-1/2">
        <center>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
            MetaMask Wallet Verification
          </h1>

          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Verify Account
          </button>

          <h3 className="text-lg font-medium text-gray-700 mt-4">
            Address:
            <span className="text-purple-500 font-bold ml-2">
              {defaultAccount}
            </span>
          </h3>
          <h3 className="text-lg font-medium text-gray-700 mt-2">
            Balance:
            <span className="text-green-500 font-bold ml-2">
              {userBalance} ETH
            </span>
          </h3>

          {errorMessage && (
            <h4 className="text-red-500 font-medium mt-4">{errorMessage}</h4>
          )}
        </center>
      </div>
    </div>
  );
};

export default MetaMask;
