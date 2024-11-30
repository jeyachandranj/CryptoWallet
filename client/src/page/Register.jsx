import React, { useState, useEffect, useContext } from "react";
import "./Register.css"; // Assume you have some default styles in this CSS file
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa"; // Importing FontAwesome Icons
import { useNavigate } from "react-router-dom";
import { TiTickOutline } from "react-icons/ti";
import { TransactionContext } from "../context/TransactionContext";

const generateRandomId = (length) => {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const Registration = () => {
  const [walletStatus, setWalletStatus] = useState(false);
  const [networkStatus, setNetworkStatus] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [balance, setBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);  
  const [userBalance, setUserBalance] = useState(null);
  const [randomId, setRandomId] = useState('');
  const [address, setAddress] = useState(false);
  const [userReference_id, setUserReference_id] = useState("");
  const [reference_id, setReference_id] = useState("0");
  const [sponsoar, setSponsoar] = useState(false);
  const [wallet,setWallet] = useState(false);
  const [alertShown, setAlertShown] = useState(false);  
  const [tokenTxn,setTokenTxn] = useState(false);

  const { currentAccount, connectWallet, handleChange, sendTransaction, formData, isLoading } = useContext(TransactionContext);
  const navigate = useNavigate();
  localStorage.setItem("address",currentAccount);

  
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if(currentAccount)
        {
          console.log("hi",currentAccount);
          setWallet(true)
        }
    };
    fetchAccountDetails();
  }, []);

  const handleRegister = () => {
    if (tokenTxn && userReference_id.trim() === reference_id.trim()) {
      handleGenerate();
      navigate("/userDetails");
    }
    else{
      alert("Invalid Referral Id");
    }
  };

  const handleCheck = async () => {
    try {
      const response = await fetch("https://cryptowallet-2.onrender.com/api/check-random-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ randomId: userReference_id.trim(), Account: " " }),  // Send account too
      });
  
      const data = await response.json();
      console.log("data", data);
  
      // If the randomId or Account exists
      if (data.exists) {
        setReference_id(userReference_id.trim());
  
        // Set state for TokenTxn value from response
        setTokenTxn(data.TokenTxn); // Set TokenTxn state
  
        // Check if the randomId matches the reference_id
        if (tokenTxn && userReference_id.trim() === reference_id.trim()) {
          setSponsoar(true);
        }
      } else {
        // Handle case where ID or Account does not exist (optional logic)
        setTokenTxn(false); // Set TokenTxn state to false if no record exists
      }
  
      // Show alert if not already shown
      if (!alertShown) {
        alert("Please click the button");
        setAlertShown(true);
      }
  
    } catch (error) {
      console.error("Error checking random ID:", error);
    }
  };
  

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setUserReference_id(value)
    localStorage.setItem('ReferalId',value);
    console.log("user",value);
    console.log("referrr",reference_id);
    
  };

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
          body: JSON.stringify({ randomId: newId, Account: " " }),  // Send account too
        });

        const data = await response.json();

        if (!data.exists) {
          isUnique = true;
          setRandomId(newId);
          localStorage.setItem('randomId',newId);
          sendRandomIdToBackend(newId);  // Send to backend once unique ID is generated
        } else {
          console.log(data.message);  // Handle case where ID or account already exists
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
        body: JSON.stringify({ randomId: id, Account: currentAccount }),  // Send account
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-bg-transactions">
      <div className="white-glassmorphism w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-4">
          Register in The Climate Crew
        </h1>
        <p className="mb-5">Enter ID or Temz wallet</p>

        {/* Sponsor ID Input Field */}
        <div className="flex items-center space-x-3">
  <input
    type="text"
    placeholder="TemZ ID"
    value={userReference_id}
    onChange={handleChangeInput}
    className="input-field mb-7 w-full py-3 px-3 bg-grey text-black rounded-md"
  />
  <button className="py-3 px-5 bg-blue-500 text-white rounded-md mb-[30px]" onClick={handleCheck}>Click</button>
</div>


        {/* Conditional Error or Success Messages */}
        <div className={'mb-7 text-green-500 text-red-500'}>
          <p className={`flex items-center mb-3 mr-2 ${sponsoar ? 'text-green-500' : 'text-red-500'}`} >
            {sponsoar? <TiTickOutline className={`mr-2 ${sponsoar ? 'text-green-500' : 'text-red-500'}`} />:
            <FaTimesCircle className={`mr-2 ${sponsoar ? 'text-green-500' : 'text-red-500'}`} />}
            TemZ ID : {sponsoar ? 'member Found' : 'member Not Found'}
          </p>
          <p className={`flex items-center mb-3 mr-2 ${sponsoar ? 'text-green-500' : 'text-red-500'}`} >
          {sponsoar? <TiTickOutline className={`mr-2 ${sponsoar ? 'text-green-500' : 'text-red-500'}`} />:
            <FaTimesCircle className={`mr-2 ${sponsoar ? 'text-green-500' : 'text-red-500'}`} />}
            Registration : {sponsoar ? 'Available' : 'Not Available'}
          </p>
          <p className={`flex items-center mb-3 mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} >
            {wallet? <TiTickOutline className={`mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} />:
              <FaTimesCircle className={`mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} />}
             Wallet :{wallet? ' Connected' : 'Not connected'}
          </p>
          <p className={`flex items-center mb-3 mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} >
          {wallet? <TiTickOutline className={`mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} />:
              <FaTimesCircle className={`mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} />}
           Network : {wallet? 'TemZ' : " "}
          </p>
          <p className={`flex items-center mb-3 mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} >
          {wallet? <TiTickOutline className={`mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} />:
              <FaTimesCircle className={`mr-2 ${wallet ? 'text-green-500' : 'text-red-500'}`} />}
           Balance : 20
          </p>
          <p className="flex items-center mb-3">
            <FaTimesCircle className="mr-2" /> Approve Temz Required
          </p>
        </div>

        {errorMessage && (
          <h4 className="text-red-500 font-medium mt-4">{errorMessage}</h4>
        )}

        {/* Register Button */}
        <div className="flex justify-center space-x-4">
          <button className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
