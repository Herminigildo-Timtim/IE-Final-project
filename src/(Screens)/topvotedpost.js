import React from "react";
import './../(Components)/css/TopVotedPost.css'; // Import your CSS file for styling
import logo from './../(Components)/images/logo.webp';

function Topvotedpost() {
  return (
    <div className="app">
      <header className="header-header">
        <div className="logo">
          <img src={logo} className="header-logo" alt="logo" />
          <span>BlokcNote</span>
        </div>
        <div className="navigation-bars"> 
          <nav>
            <ul>
              <li><a href="#new">New Topic</a></li>
              <li><a href="#hot">Hot Picks</a></li>
              <li><a href="#trending">Trending Tags</a></li>
              <li><a href="#top">Top Voted</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="header-title">
        <h1>Most Voted Post Ranking</h1>
        <input type="text" autocomplete="off" name="text" class="input" placeholder="Topic"></input>
      </div>
      <div className="main">
        {/* Your main content goes here */}
        <div className="card-container">
            
        </div>
        <div className="card-container">

        </div>
        <div className="card-container">

        </div>
        <div className="card-container">

        </div>
        <div className="card-container">

        </div>
        <div className="card-container">

        </div>
      </div>
      <footer className='footer-footer'>
        <nav>
          <ul>
            <li><a href="#new">About Us</a></li>
            <li><a href="#hot">Terms of Service</a></li>
            <li><a href="#trending">Privacy Policy</a></li>
            <li><a href="#top">Contact Us</a></li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

export default Topvotedpost;
