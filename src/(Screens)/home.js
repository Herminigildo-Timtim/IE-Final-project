import React, { useState, useEffect } from "react";
import "./../(Components)/css/Home.css"; // Import your CSS file for styling
import logo from "./../(Components)/images/logo.webp";
import idl from "../idl.json";
import { Buffer } from "buffer";
import NewTopicModal from "./Pop-Up Screens/newtopicmodal.jsx";
import {
  PublicKey,
  SystemProgram,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";

window.Buffer = Buffer;
const network = clusterApiUrl("devnet");

function Home({ walletAddress }) {
  const PROGRAM_ID = new PublicKey(idl.metadata.address);

  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [topVotes, setTopVotes] = useState([]);
  const [topComments, setTopComments] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [isOpenPost, setIsOpenPost] = useState(false);

  const navigate = useNavigate();

  const opts = {
    preflightCommitment: "processed",
  };

  const createCustomProgram = async () => {
    console.log("PROGRAM_ID:", PROGRAM_ID.toString());
    return new Program(idl, PROGRAM_ID, getProvider());
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const postList = async () => {
    try {
      const program = await createCustomProgram();
      const accounts = await program.account.postAccount.all(); // Fetch all post accounts

      const sortedPosts = accounts.sort(
        (a, b) => b.account.timestamp - a.account.timestamp
      );
      setPosts(sortedPosts);

      const topVotes = sortedPosts
        .filter((post) => post.account.voteCount > 0)
        .sort((a, b) => b.account.voteCount - a.account.voteCount)
        .slice(0, 5);
      setTopVotes(topVotes);

      const topComments = sortedPosts
        .filter((post) => post.account.commentCount > 0)
        .sort((a, b) => b.account.commentCount - a.account.commentCount)
        .slice(0, 5);
      setTopComments(topComments);
    } catch (error) {
      console.log("Error in postList: ", error);
    }
  };

  const fetchTags = async () => {
    try {
      const program = await createCustomProgram();
      const tagAccounts = await program.account.addTagAccount.all(); // Fetch all tag accounts

      const tags = tagAccounts.map((tagAccount) => tagAccount.account.name);
      setTrendingTags(tags);
    } catch (error) {
      console.log("Error fetching tags: ", error);
    }
  };

  const newPost = () => {
    setIsOpenPost(true);
  };

  const handleCloseModal = () => {
    setIsOpenPost(false);
  };

  const goTop = () => {
    navigate("/topTopics", { state: { walletAddress } });
  };

  useEffect(() => {
    postList();
    fetchTags();
  }, []);

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
              <li>
                <a href="#new">New Topic</a>
              </li>
              <li>
                <button onClick={goTop}>Hot Picks</button>
              </li>
              <li>
                <a href="#trending">Trending Tags</a>
              </li>
              <li>
                <a href="#top">Top Voted</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="main">
        <button className="btn-31" onClick={newPost}>
          <span className="text-container">
            <span
              className="text"
              style={{ color: "white", fontFamily: "sans-serif" }}
            >
              New Post
            </span>
          </span>
        </button>
        {isOpenPost && (
          <NewTopicModal
            open={isOpenPost}
            onClose={handleCloseModal}
            getProvider={getProvider}
            createCustomProgram={createCustomProgram}
          />
        )}
        <div className="new-topic">
          <h1>New Topic</h1>
          {posts.length > 0 && (
            <div className="contained">
              {posts.map((post, index) => (
                <div key={index} className="cardcont">
                  <h3>{post.account.name}</h3>
                  <p>Vote Count: {post.account.voteCount}</p>
                  <p>Comment Count: {post.account.commentCount}</p>
                  <p>From: {walletAddress}</p>
                  <p>
                    Timestamp:{" "}
                    {new Date(post.account.timestamp * 1000).toLocaleString()}
                  </p>
                  {/* Additional content rendering if needed */}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hot-picks">
          <h1>Hot picks</h1>
          {topComments.length > 0 && (
            <div className="contained">
              {topComments.slice(0, 10).map((post, index) => (
                <div key={index} className="cardcont">
                  <h3>{post.account.name}</h3>
                  <p>Comment Count: {post.account.commentCount}</p>
                  <p>From: {walletAddress}</p>
                  <p>
                    Timestamp:{" "}
                    {new Date(post.account.timestamp * 1000).toLocaleString()}
                  </p>
                  {/* Additional content rendering if needed */}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="trending-tags">
          <h1>Trending Tags</h1>
          {trendingTags.length > 0 && (
            <div className="contained">
              {trendingTags.map((tag, index) => (
                <div key={index} className="cardcont">
                  <h3>{tag}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="top-voted">
          <h1>Top voted</h1>
          {topVotes.length > 0 && (
            <div className="contained">
              {topVotes.map((post, index) => (
                <div key={index} className="cardcont">
                  <h3>{post.account.name}</h3>
                  <p>Vote Count: {post.account.voteCount}</p>
                  <p>Comment Count: {post.account.commentCount}</p>
                  <p>From: {walletAddress}</p>
                  <p>
                    Timestamp:{" "}
                    {new Date(post.account.timestamp * 1000).toLocaleString()}
                  </p>
                  {/* Additional content rendering if needed */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer className="footer-footer">
        <nav>
          <ul>
            <li>
              <a href="#new">About Us</a>
            </li>
            <li>
              <a href="#hot">Terms of Service</a>
            </li>
            <li>
              <a href="#trending">Privacy Policy</a>
            </li>
            <li>
              <a href="#top">Contact Us</a>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

export default Home;
