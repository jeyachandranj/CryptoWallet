import React, { useState,useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { FaInfoCircle, FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png"

const Login = () => {
  const[userReference_id,setUserReference_id] = useState(" ");
  const[reference_id,setReference_id] = useState("");
  const [totalRegistrations, setTotalRegistrations] = useState(0); // State to store total registrations
  const navigate = useNavigate();

  console.log()

  useEffect(() => {
    // Fetch the total registrations from the API when the component mounts
    const fetchTotalRegistrations = async () => {
      try {
        const response = await fetch("https://cryptowallet-2.onrender.com/api/total-registrations");
        const data = await response.json();
        setTotalRegistrations(data.total); // Update state with the total count
      } catch (error) {
        console.error("Error fetching total registrations:", error);
      }
    };

    fetchTotalRegistrations();
  }, []);

  const handleCheck = async (id) => {
    try {
      const response = await fetch("https://cryptowallet-2.onrender.com/api/check-random-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ randomId: id, Account: " " }),  // Send account too
      });

      const data = await response.json();
      console.log("data",data);

      if (data.exists) {
        setReference_id(id.trim());
      } 
    } catch (error) {
      console.error("Error checking random ID:", error);
    }
};


  const handleRegister = () => {
    handleCheck(userReference_id);
    if (userReference_id === reference_id) {
      navigate("/logindashboard", { state: { randomId: userReference_id } });
    }
    localStorage.setItem("rootID",userReference_id)
  };

  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Password:', password);
    if(password == "vaishnav@123")
    {
      navigate("/admin");
    }
    else{
      togglePopup();
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center gradient-bg-transactions">
      <main className="flex flex-col items-center w-full px-4">
        {/* Registration Section */}
        <section className="white-glassmorphism text-base rounded-lg p-8 mt-8 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Register in Temz</h1>
            <p className="mt-2">
              Wallet is not a member of The Climate Crew. You can use this
              wallet to register as a new member.
            </p>
            <div className="mt-4">
              <Link
                to={"/register"}
                className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                Register
              </Link>
            </div>
          </div>
          <img
        src={logo}
        alt="The Rich Crowd Icon"
        className="h-24 mt-4 md:mt-0 cursor-pointer"
        onClick={togglePopup}
      />

{isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 rounded-lg shadow-lg text-white">
            <h2 className="text-xl mb-4">Enter Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={handlePasswordChange}
                className="border border-white rounded p-2 mb-4 w-full text-black"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-2 rounded mr-2"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-white text-black px-4 py-2 rounded"
                  onClick={togglePopup}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </section>

        {/* Account Preview Section */}
        <section className="text-center mt-12 w-full max-w-4xl">
          <h2 className="text-2xl font-bold">Account preview</h2>
          <p className="mt-2">
            Look up any The Climate Crew member account in preview mode. Enter
            ID or Temz address to preview a random account.
          </p>
          <div className="mt-4 flex flex-col md:flex-row justify-center">
            <input
              type="text"
              placeholder="Enter ID "
              style={{ color: "white" }}
              onChange={(e) => setUserReference_id(e.target.value)} 
              className="p-2 rounded-t-lg md:rounded-l-lg md:rounded-r-none border border-gray-600 bg-black text-white w-full md:w-auto"
            />
            <button
              className="bg-blue-500 text-white py-2 px-7 rounded-b-lg md:rounded-r-lg md:rounded-l-none w-full md:w-auto"
              style={{ backgroundColor: "blue", color: "white" }}
             onClick={handleRegister}

            >
              Login
            </button>
          </div>
        </section>

        {/* Platform Activity Section */}
        <section className="mt-12 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center">
            Platform recent activity
          </h2>
          <div className="mt-4 flex flex-col md:flex-row justify-between">
            <div className="bg-gray-800 p-4 rounded-lg w-full md:w-1/2 mb-4 md:mb-0 md:mr-2">
              <div className="flex justify-between items-center">
                <span>
                  Members total <FaInfoCircle />
                </span>
                <span>{totalRegistrations}</span> 
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>
                  Members received, Temz <FaInfoCircle />
                </span>
                <span>{totalRegistrations*100}</span> {/* Display total registrations from API */}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg w-full md:w-1/2 md:ml-2">
              <div className="flex justify-between items-center">
                <span>The Climate Crew Contracts</span>
                <span className="text-xs">
                0x1745b15289C7cf31d6FC250b817cd6f0C55F352e <FaCopy />
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Transactions made</span>
                <span>
                  0
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Turnover, Temz</span>
                <span>{totalRegistrations*100}</span> {/* Display total registrations from API */}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
