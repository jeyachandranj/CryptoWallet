import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { createContact,makePayout } from "../utils/RazorPay";
import axios from 'axios'
import { contractABI, contractAddress } from "../utils/constants";
import { BsCheckLg } from "react-icons/bs";

export const  TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

const addToken = async () => {
  console.log("first")
  try {
    // TEMZ Token Information
    const tokenAddress = contractAddress; // Replace with your token's contract address
    const tokenSymbol = "TEMZ"; // Replace with your token's symbol
    const tokenDecimals = 18; // Typically 18, but replace with your token's decimal precision if different

    // Add TEMZ Token to MetaMask
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Token type
        options: {
          address: tokenAddress, // The contract address of the token
          symbol: tokenSymbol, // A string, up to 11 characters
          decimals: tokenDecimals, // Number of decimals in the token
        },
      },
    });

    if (wasAdded) {
      console.log(`${tokenSymbol} added to MetaMask!`);
    } else {
      console.log("Token not added.");
    }
  } catch (error) {
    console.error("Error adding token to MetaMask", error);
  }
};


const switchNetwork = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask is not installed");

    // Binance Smart Chain Mainnet Configuration
    const bscMainnet = {
      chainId: "0x38", // 56 in decimal
      chainName: "Binance Smart Chain Mainnet",
      nativeCurrency: {
        name: "Binance Coin",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      blockExplorerUrls: ["https://bscscan.com/"],
    };

    // Check if MetaMask is already connected to Binance Smart Chain Mainnet
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: bscMainnet.chainId }],
    });
    // Check if MetaMask is already connected to Binance Smart Chain Mainnet
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: bscMainnet.chainId }],
    });

    console.log("Switched to Binance Smart Chain");
  } catch (error) {
    // If the network is not added to MetaMask, add it
    if (error.code === 4902) {
      try {
        const bscMainnet = {
          chainId: "0x38", // 56 in decimal
          chainName: "Binance Smart Chain Mainnet",
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: ["https://bsc-dataseed.binance.org/"],
          blockExplorerUrls: ["https://bscscan.com/"],
        };

        // Add Binance Smart Chain Mainnet to MetaMask
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [bscMainnet],
        });

        console.log("Binance Smart Chain added and switched");
      } catch (addError) {
        console.error("Failed to add Binance Smart Chain", addError);
      }
    } else {
      console.error("Failed to switch network", error);
    }
  }
};



export const TransactionsProvider = ({ children }) => {
  let method = localStorage.getItem("method");
//   let address = String(allData.walletaddress);
// let binary = String(allData.binary);
// let matrix = String(allData.matrix);
  console.log("method", method);
  let amount = "0.53"; 
  if (method === 'binary') {
    amount = "0.11"; 
  } else if (method === 'matrix') {
    amount = "0.53"; 
  }

  const [formData, setFormData] = useState({
    addressTo1: "0xa06D78837e5dFBd09C5Be990832C5d3f13a604c1",
    amount1: amount,
    message: "Convenience Charge",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  const [fetchedAmount,setFetchedamount] = useState();
  const [fetchedWallet,setWallet]= useState()
  const [transactions, setTransactions] = useState([]);
  const [referencs_id, setReference_id] = useState("0");
  const [payment, setPayment] = useState(false);
  const [checkBalance, SetCheckBalance] = useState(false);
  const [TokenTxn, setTokenTxn] = useState(false);


  const name = localStorage.getItem("name");

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed (either on desktop or mobile)
      const { ethereum } = window;

      if (!ethereum) {
        // Check if on a mobile device
        if (window.innerWidth <= 768) {
          // Direct mobile users to the MetaMask app
          const dappUrl = "climatecrew.info"; // Your dApp URL without 'https://'
          const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
          window.open(metamaskAppDeepLink, "_blank");
        } else {
          alert("Please install MetaMask.");
        }
        return;
      }

      // If MetaMask is installed, proceed to connect the wallet
      switchNetwork();
     // addToken()

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Handle account change (especially useful if users switch accounts)
      accountChanged(accounts[0]);

      setCurrentAccount(accounts[0]);

      // Optionally reload the page after connecting the wallet
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  //  const TrustWallet = async () => {
  //    try {
  //      console.log("Initializing WalletConnect provider...");

  //      // Use Infura endpoint for opBNB mainnet
  //      const provider = new WalletConnectProvider({
  //        rpc: {
  //          56: "https://opbnb-mainnet.infura.io/v3/e21a3d8ffc304d2bb73852c7e0cd0212", // Infura endpoint for opBNB
  //        },
  //        qrcode: true, // Enable QR code for WalletConnect
  //      });

  //      // Enable WalletConnect session (show QR code to scan)
  //      await provider.enable();
  //      console.log("WalletConnect provider enabled...");

  //      // Create ethers provider using WalletConnect provider
  //      const ethersProvider = new ethers.providers.Web3Provider(provider);
  //      console.log("Ethers provider initialized...");

  //      // Get signer and account
  //      const signer = ethersProvider.getSigner();
  //      const account = await signer.getAddress();

  //      // Set connected account to state
  //      setCurrentAccount(account);
  //      console.log("Connected account:", account);
  //    } catch (error) {
  //      console.error("Error connecting to Trust Wallet:", error);
  //      alert("Unable to connect to Trust Wallet. Please try again.");
  //    }
  //  }

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await fetch(
          "https://cryptowallet-2.onrender.com/api/account"
        );
        const data = await response.json();
        setReference_id(data.referralId);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };
    fetchAccountDetails();
  }, []);

  useEffect(() => {
   const getAllData = async () => {
     try {
       const response = await axios.get(
         "https://cryptowallet-2.onrender.com/getalldata"
       );
       console.log(response.data); // Logs the actual data from the response
       setFetchedamount(response.data[0].matrix)
       console.log(response.data)
       setWallet(response.data[0].walletaddress)
     } catch (error) {
       console.log("Error fetching data:", error);
     }
   };

    getAllData()
  },[])

  console.log(referencs_id);

  const handleTokenTxnChange = async () => {
    try {
      const response = await fetch(
        "https://cryptowallet-2.onrender.com/storeTokenTxn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            tokenTxn: TokenTxn,
          }),
        }
      );

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error storing TokenTxn:", error);
    }

    setTokenTxn((prev) => !prev);
  };


  

  const accountChanged = (accountName) => {
    getUserBalance(accountName); // Get balance after setting the account
  };

  const getUserBalance = async (accountAddress) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accountAddress, "latest"],
      });
      const balanceInEth = ethers.utils.formatEther(balance);

      if (Number(balance) <= ethers.utils.parseEther("5000")) {
        SetCheckBalance(true);
        navigate("/userDetails");
      } else {
        alert("Insufficient balance. You need at least 5000 wei to proceed.");
        toast("Insufficient Balance! You need 5000 wei to proceed.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch balance. Please try again.");
    }
  };

  const sendTokens = async () => {
    console.log('fetchedamount',fetchedAmount)
    try {
      if (ethereum) {
        const { addressTo1, amount1, message } =
          formData; // Updated to include different amounts
        const transactionsContract = createEthereumContract();
        const parsedAmount1 = ethers.utils.parseEther(amount1); // Parse amount for the first address

        // Send to the first address
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo1, // First recipient
              gas: "0x5208",
              value: parsedAmount1._hex,
            },
          ],
        });

        const transactionHash1 = await transactionsContract.addToBlockchain(
          addressTo1,
          parsedAmount1,
          message,
        );
        console.log(`Loading - ${transactionHash1.hash}`);
        await transactionHash1.wait();
        await handleTokenTxnChange();
        console.log(`Success - ${transactionHash1.hash}`);
        setTokenTxn(true)
        alert("TEMZ tokens sent successfully!")


       const transactionsCount =
         await transactionsContract.getTransactionCount();
       setTransactionCount(transactionsCount.toNumber());
       window.location.reload();
       console.log("TEMZ tokens sent successfully!");
     } else {
       console.log("No ethereum object");
     }
   } catch (error) {
     setTokenTxn(false);
     alert(error.message)
     console.log(error.message);
     throw new Error("Transaction failed");
   }
 };


 
   const sendTransaction = async () => {
     try {
       if (ethereum) {
         const { addressTo1, amount1, message } = formData; // Data from form
         const transactionsContract = createEthereumContract();

         // TEMZ Token Contract Address
         const temzTokenAddress = contractAddress; // Replace with actual token contract address
         const temzTokenABI = contractABI;

         // Set up ethers.js provider and signer (the current MetaMask account)
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         // Create a contract instance for the TEMZ token
         const temzContract = new ethers.Contract(
           temzTokenAddress,
           temzTokenABI,
           signer
         );

         // Parse the token amount (make sure you account for token decimals, typically 18 for ERC-20 tokens)
         const decimals = 18; // Replace with your token's decimals if different
         const parsedAmount1 = ethers.utils.parseUnits(amount1, decimals); // Convert amount1 to the token's smallest unit

         // Set gas limit and estimate gas for the transaction
         const gasLimit = await temzContract.estimateGas.transfer(
           addressTo1,
           parsedAmount1
         );

         // Send TEMZ tokens to the recipient using the `transfer` method of the token contract
         const transactionResponse = await temzContract.transfer(
           addressTo1,
           parsedAmount1,
           {
             gasLimit: gasLimit.add(10000), // Add extra gas for safety
           }
         );
         console.log(`Loading - ${transactionResponse.hash}`);

         // Wait for the transaction to be confirmed
         const receipt = await transactionResponse.wait();
         console.log(`Success - ${receipt.transactionHash}`);

         // Perform any further actions like storing the transaction on the blockchain
         const transactionHash1 = await transactionsContract.addToBlockchain(
           addressTo1,
           parsedAmount1,
           message
         );
         console.log(`Stored transaction - ${transactionHash1.hash}`);

         // Optional: Handle state changes, reload, or payout logic
         setTokenTxn(true);
         await handleTokenTxnChange();
         console.log("Tokens sent and ₹1000 payout made to the referrer.");

         const transactionsCount =
           await transactionsContract.getTransactionCount();
         setTransactionCount(transactionsCount.toNumber());
         window.location.reload();
       } else {
         console.log("No ethereum object");
       }
     } catch (error) {
       setTokenTxn(false);
       console.log(error);
       throw new Error("Transaction failed");
     }
   };



  







  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        payment,
        checkBalance,
        sendTransaction,
        sendTokens,
        handleChange,
        formData,

      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
