import React from "react";
import { Link } from "react-router-dom"; // for routing
import Spline from '@splinetool/react-spline';
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>Billing Assistant</h2>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/chatbot" className="nav-link">Chatbot</Link>
          </li>
          <li>
            <Link to="/bills" className="nav-link">Bills</Link>
          </li>
          <li>
            <Link to="/profile" className="nav-link">Profile</Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link">Settings</Link>
          </li>
          <li>
            <Link to="/logout" className="nav-link">Logout</Link>
          </li>
        </ul>
      </nav>

      <header className="home-header">
        <h1>Welcome to the Billing Assistant!</h1>
        <p>Your one-stop solution for managing bills and items.</p>
      </header>
      
      <div className="spline-background">
        <Spline scene="https://prod.spline.design/WQOhTY9TlxPJEq6X/scene.splinecode" />
      </div>
      
      <footer className="footer">
        <p>&copy; 2024 Billing Assistant</p>
      </footer>
    </div>
  );
};

export default Home;
