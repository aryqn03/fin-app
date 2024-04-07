import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">Overview</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/bills">Bills</Link>
      <Link to="/settings">Settings</Link>
    </div>
  );
};

export default Navbar;
