import React from "react";
import { Link } from "react-router-dom"; // for routing
import Spline from '@splinetool/react-spline';
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>conversoDB</h2>
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
        <h1>Welcome to the conversoDB!</h1>
        <p>Your one-stop solution for managing bills and items.</p>
      </header>
      
      <div className="spline-background">
        {/* <Spline scene="https://prod.spline.design/WQOhTY9TlxPJEq6X/scene.splinecode" /> */}
        {/* <Spline scene="https://prod.spline.design/xz5okzxw3erJedlW/scene.splinecode" />  */}
        {/* <Spline scene="https://prod.spline.design/Dpz2rOssjllsgyvh/scene.splinecode" /> */}
        {/* <Spline scene="https://prod.spline.design/9zQFgSv8q1Evf0WS/scene.splinecode" /> */}
        <Spline scene="https://prod.spline.design/oR8PwXXParsI1BxN/scene.splinecode" />
      </div>
      
      <footer className="footer">
        <p>&copy; 2024 conversoDB</p>
      </footer>
    </div>
  );
};

export default Home;
