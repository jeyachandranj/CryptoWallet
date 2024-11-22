import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const LoginDashBoard = () => {
  const location = useLocation();
  const { randomId } = location.state;
  const [account, setAccount] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");

  const { currentAccount, sendTokens, payment } =
    useContext(TransactionContext);

  const handleSubmit = () => {
    sendTokens();
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        setAccount(currentAccount);

        const response = await fetch(
          `http://ec2-13-126-194-20.ap-south-1.compute.amazonaws.com:5000/api/getDetails?randomId=${randomId}`
        );
        console.log("responselogin", response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTableData(data);
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

  // Count the number of rows where status is true (checked)
  const getCheckedCount = () => {
    return tableData.reduce((count, row) => {
      return row.status ? count + 1 : count;
    }, 0);
  };

  // Check if the number of checked rows is divisible by 3
  const shouldDisplayButton = () => {
      return true;
  };

  return (

    <div className= "flex h-screen">

       <Sidebar randomId={randomId}/>


       <div className="flex-1 bg-gray-900 flex items-center justify-center p-4">
       <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* New Card: Message for generating referral ID */}
            {payment && (
              <div className="bg-red-500 text-white p-4 mb-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold">Action Required</h3>
                <p className="text-sm">
                  Please send <strong>200 tokens</strong> to generate your referral ID.
                </p>
              </div>
            )}

            {/* Existing Card */}
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-16 w-16 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold">CLIMATE CREW</h2>
                <p className="text-sm">{account}</p>
                {!payment && (
                  <p className="text-xs text-gray-400 text-center p-0.5 white-glassmorphism">
                    ID m_{randomId}
                  </p>
                )}
              </div>
            </div>

            {/* Personal Link */}
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h3 className="text-sm">Personal link</h3>
              <a
              href="https://climatecrew.info/dashboard"
              className="text-yellow-500 text-sm hover:underline"
            >
              https://climatecrew.info/dashboard
            </a>
            </div>

            {/* Token Info */}
            <div className="bg-blue-500 p-4 rounded-lg flex items-center justify-between">
              <span className="text-white">TEMZ/BNB</span>
              <span className="text-lg font-bold">60 USD</span>
            </div>

            {/* New Table */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Referral Status</h3>
              <table className="table-auto w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">RandomId</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{row.name}</td>
                      <td className="border px-4 py-2">{row.randomId}</td>
                      <td className="border px-4 py-2">
                        <input
                          type="checkbox"
                          checked={row.status}
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Conditionally render the button based on the checked status count */}
            {shouldDisplayButton() && (
              <div className="flex justify-center">
                <button
                  className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 mt-4"
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#06D6A0", color: "black" }}
                >
                  Send Tokens
                </button>
              </div>
            )}
          </div>
        </div>

     
    </div>
  );
};

export default LoginDashBoard;
