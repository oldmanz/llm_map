import React from 'react';
import '../styles/NavBar.css'; // Optional: Add styles for the NavBar

const NavBar: React.FC = () => {
  return (
    <nav>
      <img src="images/llm_map_logo.svg" alt="Logo" className="logo" />
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
