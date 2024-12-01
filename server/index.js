const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: false  
}));




mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
    .catch((err) => console.log("Error connecting to MongoDB Atlas:", err));


// mongoose.connect("mongodb://localhost:27017/cryptowallet")
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.log("Error connecting to MongoDB:", err));

const randomIdSchema = new mongoose.Schema({
  randomId: { type: String, unique: true, required: true },
  account: { type: String, unique: true, required: true },  // Make account unique
  contact_id: { type: String  },

  createdAt: { type: Date, default: Date.now },
});


const RandomId = mongoose.model("RandomId", randomIdSchema);

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Add name field
  email: { type: String, required: true }, // Add email field
  mobileNumber: { type: String, required: true }, // Add mobileNumber field
  paymentMethod: { type: String, required: true },
  Referalid: { type: String, required: true },
  randomId: { type: String, unique: true, required: true },
  address: { type: String, unique: true, required: true },  // Make account unique
  TokenTxn: { type: Boolean, default: false },
});



const Registration = mongoose.model('Registration', registrationSchema);

const formSchema = new mongoose.Schema({
  walletId:String,
  walletaddress: String,
  binary: String,
  matrix: String,
});
const FormData = mongoose.model('FormData', formSchema);



app.put('/submit', async (req, res) => {
  const { walletId, ...updatedData } = req.body;

  try { 
    // Check if walletId exists in the request
    if (!walletId) {
      return res.status(400).send({ error: 'walletId is required' });
    }

    // Update the existing document based on walletId
    const updatedFormData = await FormData.findOneAndUpdate(
      { walletId },  // Filter: Find the document by walletId
      { $set: updatedData },  // Update: Overwrite the existing fields with new data
      { new: true, upsert: true } // Return the updated document; if it doesn't exist, create it
    );

    if (!updatedFormData) {
      return res.status(404).send({ error: 'No form data found for the given walletId' });
    }

    res.status(200).send({ message: 'Form data updated successfully', data: updatedFormData });
  } catch (error) {
    console.error('Error updating form data:', error);
    res.status(500).send({ error: 'Error updating form data' });
  }
});


app.get('/getLastUpdatedData', async (req, res) => {
  try {
    const lastUpdatedData = await FormData.findOne().sort({ _id: -1 });

    if (!lastUpdatedData) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json(lastUpdatedData);
  } catch (error) {
    console.error('Error fetching last updated form data:', error);
    res.status(500).json({ message: 'Error fetching form data' });
  }
});




// Check if the randomId or Account already exists
app.post("/api/check-random-id", async (req, res) => {
  const { randomId, Account } = req.body;

  try {
    // Check if randomId or account exists
    const existingRecord = await Registration.findOne({
      $or: [{ randomId }, { account: Account }]
    });

    if (existingRecord) {
      res.json({
        exists: true,
        randomId: existingRecord.randomId,
        TokenTxn: existingRecord.TokenTxn,
        message: 'ID or account already exists.'
      });
    } else {
      res.json({
        exists: false,
        randomId,
        TokenTxn: false, 
        message: 'ID or account does not exist.'
      });
    }
  } catch (error) {
    console.error("Error checking random ID:", error);
    res.status(500).json({ success: false, message: "Error checking random ID." });
  }
});

function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Letters only
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Save randomId and Account, ensuring uniqueness
app.post("/api/save-random-id", async (req, res) => {
  const { randomId, Account } = req.body;
  console.log('randomId,',req.body)

  try {
    const newRandomId = new RandomId({
      randomId,
      account: Account,
      contact_id: generateRandomId(10) 
    });
    await newRandomId.save(); 
    res.json({ success: true, message: "Random ID saved successfully." });
  } catch (error) {
    console.error("Error saving random ID:", error);
    res.status(500).json({ success: false, message: "Error saving random ID." });
  }
});

app.get("/api/account", async (req, res) => {
  try {
    const accountDetails = await RandomId.findOne().sort({ createdAt: -1 });

    if (accountDetails) {
      res.json({
        account: accountDetails.account,
        referralId: accountDetails.randomId, 
      });
    } else {
      res.status(404).json({ message: "Account details not found" });
    }
  } catch (error) {
    console.error("Error fetching account details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/total-registrations', async (req, res) => {
  try {
    const totalCount = await Registration.countDocuments({});
    res.status(200).json({ total: totalCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

app.get("/api/getDetails", async (req, res) => {  
  const { randomId } = req.query;   
  console.log("Received randomId:", randomId); // Log the received randomId  

  try {  
    const registrations = await Registration.find({ Referalid: randomId }); 

    if (registrations.length > 0) {
      // Prepare the response in the required format
      const tableData = registrations.map(registration => ({
        name: registration.accountHolderName,
        randomId: registration.randomId,
        status: registration.TokenTxn,
      }));

      return res.status(200).json(tableData); // Send the data as a response
    } else {
      return res.status(404).json({ message: "No matching records found." });
    }
  } catch (error) {
    console.error("Error fetching registration data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



//save the user Details
app.post('/api/register', async (req, res) => {
  const { name, email, mobileNumber, paymentMethod, Referalid, randomId,address } = req.body;

  try {
    // Check if the mobile number already exists
    const existingUser = await Registration.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Linked Mobile Number already exists!' });
    }

    // Create new registration entry
    const newRegistration = new Registration({
      name,
      email,
      mobileNumber,
      paymentMethod,
      Referalid,
      randomId,
      address
    });

    await newRegistration.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/storeTokenTxn', async (req, res) => {
  const { name, tokenTxn } = req.body;

  if (!name || tokenTxn === undefined) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    let user = await Registration.findOne({ name });

    if (user) {
      user.Registration = tokenTxn;
      await user.save();
      return res.status(200).json({ message: 'TokenTxn updated successfully' });
    } else {
      console.log("user Does not exist")
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error storing TokenTxn', error });
  }
});

//Dashboard

app.get("/api/dashboard", async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//2fv
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: 'jeyachandran72jj@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Dear User,

    Your OTP code for verifying your account on ClimateCrew is: ${otp}. This code is part of the two-factor authentication process for securing your wallet.
    
    Please enter the OTP on the ClimateCrew website to complete the verification process. If you did not initiate this request, please ignore this email.
    
    Thank you for using ClimateCrew to manage your wallet securely!
    
    Best regards,  
    The ClimateCrew Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response); // Logs successful response details
    res.status(200).json({ otp }); // Only return the OTP for testing; remove in production.
  } catch (error) {
    console.error('Error:', error); // Logs full error details
    res.status(500).json({ error: 'Error sending email', details: error.message });
  }
});




app.listen(5000, () => console.log("Server running on port 5000"));
