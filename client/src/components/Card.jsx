import React from "react";
import profile from '../../images/profile.png'
import "./Card.css"; // Include custom styles here

const Card = ({ profileImage, id }) => {
  return (
    <div className="card-container">
      <div className="avatar">
        <img src={profile} alt="Profile" className="profile-img" />
      </div>
      <div className="card-content">
        <p className="card-id">ID: {id}</p>
      </div>
    </div>
  );
};

export default Card;
