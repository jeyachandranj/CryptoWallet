import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './page/Register.jsx';
import Login from './page/Login.jsx';
import Home from "./page/Home.jsx";
import MetaMask from './page/MetaMask.jsx';
import DashBoard from './page/DashBoard.jsx';
import ReferralTree from './page/RefferalTree.jsx';
import UserDetails from './page/UserDetails.jsx';
import LoginDashBoard from './page/LoginDashBoard.jsx';
import Admin from './page/Admin.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import EmailOTPVerification from './components/EmailOTPVerification.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/meta" element={<MetaMask />} />
                <Route path="/referralTree" element={<ReferralTree />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/userDetails" element={<UserDetails />} />
                <Route path='/email-otp' element={<EmailOTPVerification/>}/>
                <Route path="/logindashboard" element={<PrivateRoute element={<LoginDashBoard />} />} />
                <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
