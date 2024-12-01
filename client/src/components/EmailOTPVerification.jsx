import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function EmailOTPVerification() {
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState(null);
  const location = useLocation();
  const email = location.state?.email || ''; 
  const navigate = useNavigate();

  const sendOtpToEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setSentOtp(data.otp); // Store OTP temporarily (for testing, replace this in prod)
      alert('OTP sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  // Function to validate OTP
  const handleOtpSubmit = () => {
    if (otp === sentOtp) {
      alert('OTP verified successfully!');
      navigate('/dashboard'); // Navigate to the next page
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="otp-verification">
      <h2>Email Verification</h2>
      <p>Email: {email}</p>
      <button onClick={sendOtpToEmail}>Send OTP</button>
      <div>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleOtpSubmit}>Verify OTP</button>
      </div>
    </div>
  );
}

export default EmailOTPVerification;
