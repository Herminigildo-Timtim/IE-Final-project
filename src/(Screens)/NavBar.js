import React from 'react';
import logo from "./../(Components)/images/logo.webp";
import "./../(Components)/css/Home.css";

const Navbar = ({ goHome, goTop, goTopVote, goTags }) => {
  return (
    <header className="header-header" style={{ marginBottom: 0 }}>
      <div className="logo">
        <img src={logo} className="header-logo" alt="logo" />
        <span>BlokcNote</span>
      </div>
      <div className="navigation-bars">
        <nav>
          <ul>
            <li><a onClick={goHome}>New Topic</a></li>
            <li><a onClick={goTop}>Top Topics</a></li>
            <li><a onClick={goTopVote}>Top Voted</a></li>
            <li><a onClick={goTags}>Trending Tags</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
