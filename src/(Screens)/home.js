import React, { useState, useEffect } from "react";
import "./../(Components)/css/Home.css"; // Import your CSS file for styling
import idl from "../idl.json";
import { Buffer } from "buffer";
import NewTopicModal from "./Pop-Up Screens/newtopicmodal.jsx";
import { Card } from "@mui/material";
import {
  PublicKey,
  SystemProgram,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import TopicModal from "./TopicModal.jsx";
import Navbar from "./NavBar.js";
import { connectWallet } from "../functions/functions.jsx";
import ViewTagPostModal from './ViewTagPostModal';
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [topicTags, setTopicTags] = useState([]);
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
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts);
    const program = new Program(idl, PROGRAM_ID, provider);

    try {
        const fetchedTags = await program.account.addTagAccount.all();
        console.log("Fetched Tags:", fetchedTags);

        const tagCounts = {};
        fetchedTags.forEach(tag => {
            const tagName = tag.account.name;
            const tagId = tag.account.id.toString();
            const tagPubKey = tag.publicKey.toString();

            if (!tagCounts[tagName]) {
                tagCounts[tagName] = { count: 0, ids: '' };
            }
            tagCounts[tagName].count += 1;
            tagCounts[tagName].ids = tagId;
            tagCounts[tagName].pubKey = tagPubKey;

        });

        const tagCountsArray = Object.keys(tagCounts).map(tagName => ({
            tagName,
            count: tagCounts[tagName].count,
            id: tagCounts[tagName].ids,
            pubKey: tagCounts[tagName].pubKey,
        }));

        tagCountsArray.sort((a, b) => b.count - a.count);

        console.log("Sorted Tag Counts:", tagCountsArray);
        setTopicTags(tagCountsArray);
        console.log(topicTags);
    } catch (error) {
        console.error("Error fetching tags:", error);
    }
};

  const newPost = () => {
    setIsOpenPost(true);
  };
  const handleOpenModal = (topic) => {
    setSelectedTopic(topic);
    setOpenModal(true);
};

const handleCloseTopicModal = () => {
    setOpenModal(false);
    setSelectedTopic(null);
};
const handleTagClick = (tag) => {
  setSelectedTag(tag);
};
const handleCloseTagClick = (tag) => {
  setSelectedTag(null);
};
  const handleCloseModal = () => {
    setIsOpenPost(false);
    postList();
    fetchTags();
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
    postList();
    fetchTags();
    connectWallet();
  }, []);

  return (
    <>
      <div className="app">
      <Navbar goHome={goHome} goTop={goTop} goTopVote={goTopVote} goTags={goTags}/>
        <div className="main">
          {isOpenPost && (
            <NewTopicModal
              open={isOpenPost}
              onClose={handleCloseModal}
              getProvider={getProvider}
              createCustomProgram={createCustomProgram}
            />
          )}
          <div className="new-topic">
            <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
              <div style={{width: '70%'}}> <h1>New Topic</h1> </div>
              <div style={{width: '30%', alignSelf: 'center', paddingLeft: '100px'}}>
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
            </div>
          </div>
            {posts.length > 0 && (
              <Card
                className="contained"
                variant="outline"
                style={{
                  flexDirection: "row",
                  margin: "0%",
                  marginBottom: "0%",
                }}
              >
                {posts.map((post, index) => (
                  <div
                    key={index}
                    className="cardcont"
                    onClick={() => handleOpenModal(post)} 
                    style={{ display: "block", overflowY: "visible", cursor: 'pointer' }}
                  >
                    <h3>{post.account.name}</h3>
                    <p>Vote Count: {post.account.voteCount}</p>
                    <p>Comment Count: {post.account.commentCount}</p>
                    <p>From: {post.account.authority.toString()}</p>
                    <p>
                      Timestamp:{" "}
                      {new Date(post.account.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                ))}
              </Card>
            )}
          </div>

          <div className="hot-picks">
            <h1>Hot Picks</h1>
            {topComments.length > 0 && (
              <Card
                className="contained"
                variant="outline"
                
                style={{ flexDirection: "row", margin: "0%" }}
              >
                {topComments.slice(0, 10).map((post, index) => (
                  <div
                    key={index}
                    className="cardcont"
                    onClick={() => handleOpenModal(post)} 
                    style={{ display: "block", overflowY: "visible", cursor: 'pointer' }}
                  >
                    <h3>{post.account.name}</h3>
                    <p>Comment Count: {post.account.commentCount}</p>
                    <p>From: {post.account.authority.toString()}</p>
                    <p>
                      Timestamp:{" "}
                      {new Date(post.account.timestamp * 1000).toLocaleString()}
                    </p>
                    {isOpenPost && <TopicModal walletAddress={walletAddress} />}
                  </div>
                ))}
              </Card>
            )}
          </div>

          <div className="trending-tags">
            <h1>Trending Tags</h1>
            {topicTags.length > 0 && (
              <div className="contained">
                {topicTags.map((tag, index) => (
                  <Card
                    key={index}
                    className="cardcont"
                    onClick={() => handleTagClick(tag)}
                    style={{ minHeight: "62.23px", cursor: 'pointer', width: '200px'}}
                  >
                    <h3>{tag.tagName}</h3>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="top-voted">
          
                <h1>Top voted</h1>
            {topVotes.length > 0 && (
              <div className="contained">
                {topVotes.map((post, index) => (
                  <div key={index} className="cardcont" onClick={() => handleOpenModal(post)} style={{cursor: 'pointer'}}>
                    <h3>{post.account.name}</h3>
                    <p>Vote Count: {post.account.voteCount}</p>
                    <p>Comment Count: {post.account.commentCount}</p>
                    <p>From: {post.account.authority.toString()}</p>
                    <p>
                      Timestamp:{" "}
                      {new Date(post.account.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {selectedTag && <ViewTagPostModal tag={selectedTag} open={!!selectedTag} close={handleCloseTagClick}/>}
            <TopicModal open={openModal} handleClose={handleCloseTopicModal} topic={selectedTopic} walletAddress={walletAddress}/>
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
    </>
  );
}

export default Home;
