import { React } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './page/Register.jsx'; // Make sure the path is correct
import Login from './page/Login.jsx';
import Home from "./page/Home.jsx";
import MetaMask from './page/MetaMask.jsx';
import DashBoard from './page/DashBoard.jsx'
import ReferralTree from './page/RefferalTree.jsx';
import UserDetails from './page/UserDetails.jsx';
import LoginDashBoard from './page/LoginDashBoard.jsx';
import Admin from './page/Admin.jsx';
function App() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path='/login' element={<Login/>}/> 
                <Route path='/meta' element={<MetaMask/>}/>
                <Route path='/referralTree' element={<ReferralTree/>}/>
                <Route path='/dashboard' element={<DashBoard/>}/>
                <Route path='/userDetails' element={<UserDetails/>}/>
                <Route path='/logindashboard' element={<LoginDashBoard/>}/>
                <Route path='/admin' element={<Admin/>}/>
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;
