const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// MongoDB connection
const uri =
  "mongodb+srv://jeyachandran72jj:jeyan%40zeone123@cryptowallet.vgo84.mongodb.net/";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Schemas and Models
const randomIdSchema = new mongoose.Schema({
  randomId: { type: String, unique: true, required: true },
  account: { type: String, unique: true, required: true },
  contact_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  Referalid: { type: String, required: true },
  randomId: { type: String, unique: true, required: true },
  address: { type: String, unique: true, required: true },
  TokenTxn: { type: Boolean, default: false },
});

const formSchema = new mongoose.Schema({
  walletId: String,
  walletaddress: String,
  binary: String,
  matrix: String,
});

const RandomId = mongoose.model("RandomId", randomIdSchema);
const Registration = mongoose.model("Registration", registrationSchema);
const FormData = mongoose.model("FormData", formSchema);

// Utility to generate random IDs
function generateRandomId(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Routes
app.put("/submit", async (req, res) => {
  const { walletId, ...updatedData } = req.body;

  try {
    const updatedFormData = await FormData.findOneAndUpdate(
      { walletId },
      { $set: updatedData },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Form data updated successfully", data: updatedFormData });
  } catch (error) {
    console.error("Error updating form data:", error);
    res.status(500).json({ error: "Error updating form data" });
  }
});

app.get("/getLastUpdatedData", async (req, res) => {
  try {
    const lastUpdatedData = await FormData.findOne().sort({ _id: -1 });
    if (!lastUpdatedData) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(lastUpdatedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/api/check-random-id", async (req, res) => {
  const { randomId, account } = req.body;
  try {
    const existingRecord = await Registration.findOne({
      $or: [{ randomId }, { account }],
    });
    if (existingRecord) {
      res.json({ exists: true, randomId: existingRecord.randomId, TokenTxn: existingRecord.TokenTxn });
    } else {
      res.json({ exists: false, randomId });
    }
  } catch (error) {
    res.status(500).json({ error: "Error checking random ID" });
  }
});

app.post("/api/save-random-id", async (req, res) => {
  const { randomId, account } = req.body;
  try {
    const newRandomId = new RandomId({ randomId, account, contact_id: generateRandomId(10) });
    await newRandomId.save();
    res.json({ success: true, message: "Random ID saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error saving random ID" });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, mobileNumber, paymentMethod, Referalid, randomId, address } = req.body;
  try {
    const existingUser = await Registration.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile number already exists!" });
    }
    const newRegistration = new Registration({ name, email, mobileNumber, paymentMethod, Referalid, randomId, address });
    await newRegistration.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Dashboard endpoint
app.get("/api/dashboard", async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Nodemailer OTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jeyachandran72jj@gmail.com",
    pass: "gdjh zmqn wrsa daue",
  },
});

app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await transporter.sendMail({
      from: "jeyachandran72jj@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}.`,
    });
    res.status(200).json({ otp });
  } catch (error) {
    res.status(500).json({ error: "Error sending OTP" });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
