import React from "react";
import { Link } from "react-router-dom"; // for routing

const Chatbot = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Chatbot Page</h2>
      <p>Welcome to the chatbot! Here you can chat with the assistant.</p>
      {/* Add chatbot logic here */}
      <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
        Go Back to Home
      </Link>
    </div>
  );
};

export default Chatbot;
