import React, { useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const CONTRACT_ABI = [
  // Paste your ABI here (from the deployed smart contract)
];

const TOKEN_ADDRESS = "YOUR_ERC20_TOKEN_ADDRESS";
const TOKEN_ABI = [
  // ERC-20 token ABI
];

const App = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [token, setToken] = useState(null);
  const [referralID, setReferralID] = useState("");
  const [balance, setBalance] = useState(0);
  const [newReferralID, setNewReferralID] = useState("");

  useEffect(() => {
    const loadWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        localStorage.setItem("address",account);

        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        const tokenInstance = new web3Instance.eth.Contract(
          TOKEN_ABI,
          TOKEN_ADDRESS
        );
        setToken(tokenInstance);

        const tokenBalance = await tokenInstance.methods
          .balanceOf(accounts[0])
          .call();
        setBalance(web3Instance.utils.fromWei(tokenBalance, "ether"));
      } else {
        alert("Please install MetaMask!");
      }
    };
    loadWeb3();
  }, []);

  const handleApprove = async () => {
    try {
      // Approve the smart contract to spend 2500 tokens on behalf of the user
      await token.methods
        .approve(CONTRACT_ADDRESS, web3.utils.toWei("2500", "ether"))
        .send({ from: account });
      alert("Approved successfully!");
    } catch (error) {
      alert("Approval failed: " + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const result = await contract.methods
        .register(referralID)
        .send({ from: account });
      if (result) {
        const newID = await contract.methods.getReferralID(account).call();
        setNewReferralID(newID);
        alert(`Registered successfully! Your new referral ID: ${newID}`);
      }
    } catch (error) {
      alert("Error during registration: " + error.message);
    }
  };

  return (
    <div>
      <h1>Referral Dapp</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Token Balance: {balance}</p>

          <input
            type="text"
            placeholder="Enter Referral ID"
            value={referralID}
            onChange={(e) => setReferralID(e.target.value)}
          />

          <button onClick={handleApprove}>Approve Tokens</button>
          <button onClick={handleRegister}>Register with Referral</button>

          {newReferralID && <p>Your new Referral ID: {newReferralID}</p>}
        </div>
      ) : (
        <p>Connect your MetaMask account to continue</p>
      )}
    </div>
  );
};

export default App;
