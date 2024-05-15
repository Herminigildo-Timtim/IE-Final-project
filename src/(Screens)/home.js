import React from 'react';
import './../(Components)/css/Home.css' // Import your CSS file for styling
import logo from './../(Components)/images/logo.webp';

function Home() {
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
      <div className="main">
        {/* Your main content goes here */}
        <div className='new-topic'>
          <h1>New Topic</h1>
          <div className='card-container'>
            <div className='card'>
              <h1>hermi</h1>
            </div>
          </div>
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

export default Home;
