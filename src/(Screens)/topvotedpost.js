import React, { useState, useEffect } from 'react';
import './../(Components)/css/TopVotedPost.css'; // Import your CSS file for styling
import logo from './../(Components)/images/logo.webp';
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from "../idl.json";
import { useNavigate } from "react-router-dom";

window.Buffer = Buffer;
const network = clusterApiUrl('devnet');

function Topvotedpost({ walletAddress }) {
  const PROGRAM_ID = new PublicKey(idl.metadata.address);

  // const [walletAddress, setWalletAddress] = useState(null);
  const [topVotes, setTopVotes] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const opts = {
    preflightCommitment: "processed"
  };

  const navigate = useNavigate();
  useEffect(() => {
    // setWalletAddress("F4coyXgjxsQGp9M3ZFR71vV8YadsJaz1oSfp2qRgCkfg");
  }, []);

  const createCustomProgram = async () => {
    return new Program(idl, PROGRAM_ID, getProvider());
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment,
    );
    return provider;
  };

  const fetchTopVotes = async () => {
    try {
      const program = await createCustomProgram();
      const accounts = await program.account.postAccount.all(); // Fetch all post accounts

      const topVotes = accounts
        .filter(post => post.account.voteCount > 0)
        .sort((a, b) => b.account.voteCount - a.account.voteCount);
      setTopVotes(topVotes);
    } catch (error) {
      console.log("Error fetching top votes: ", error);
    }
  };

  const goTop = () => {
    navigate("/topTopics", { state: { walletAddress } });
  };

  const goTopVote = () => {
    navigate("/topVoted", { state: { walletAddress } });
  };

  const goHome = () => {
    navigate("/home", { state: { walletAddress } });
  };

  const goTags = () => {
    navigate("/addTags", { state: { walletAddress } });
  };
  useEffect(() => {
    fetchTopVotes();
  }, []);

  // Function to handle input change
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="app">
      <header className="header-header" style={{marginBottom: 0}}>
                <div className="logo">
                    <img src={logo} className="header-logo" alt="logo" />
                    <span>BlokcNote</span>
                </div>
                <div className="navigation-bars">
                    <nav>
                        <ul>
                            <li><a onClick={goHome}>New Topic</a></li>
                            <li><a onClick={goTop}> Top Topics</a></li>
                            <li><a onClick={goTopVote}>Top Voted</a></li>
                            <li><a onClick={goTags}>Trending Tags</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
      <div className="header-title">
        <h1>Most Voted Post Ranking</h1>
        <input 
          type="text" 
          autoComplete="off" 
          name="text" 
          className="input" 
          placeholder="Topic"
          value={searchInput} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="main">
        {/* Display top-voted posts */}
        <div className="container-content">
          {topVotes.length === 0 ? (
            <p>No content available</p>
          ) : (
            topVotes
              .filter(post => post.account.name.toLowerCase().includes(searchInput.toLowerCase()))
              .map((post, index) => (
                <div key={index} className="card-container">
                  <h2>{post.account.name}</h2>
                  <p>Vote Count: {post.account.voteCount}</p>
                  <p>Comment Count: {post.account.commentCount}</p>
                  <p>From: {walletAddress}</p>
                  <p>Timestamp: {new Date(post.account.timestamp * 1000).toLocaleString()}</p>
                </div>
              ))
          )}
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