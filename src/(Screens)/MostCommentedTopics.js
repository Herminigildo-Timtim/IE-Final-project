import {useEffect, useState} from "react";
import { Typography, Container, Grid, Card, CardContent} from '@mui/material';
import TopicModal from './TopicModal';
import { PublicKey, Connection, clusterApiUrl, } from "@solana/web3.js";
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from '../idl.json';
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar.js";
import { connectWallet } from "../functions/functions.jsx";

window.Buffer = Buffer;
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl('devnet');
const opts = { preflightCommitment: "processed" };
const connection = new Connection(network, opts.preflightCommitment);
const provider = new AnchorProvider(connection, window.solana, opts);
const program = new Program(idl, programID, provider);

const fetchTopics = async (setTopic) => {
    
    try {
        const fetchedTopics = await program.account.postAccount.all();
        
        const sortedTopics = fetchedTopics.sort((a, b) => b.account.commentCount - a.account.commentCount);
        setTopic(sortedTopics);
    } catch (error) {
        console.error("Error fetching topics:", error);
    }
};

const fetchTopVote = async (setTopVote) => {

    try {
        const fetchedTopVote = await program.account.postAccount.all();
        
        const sortedTopVote = fetchedTopVote.sort((a, b) => b.account.voteCount - a.account.voteCount);
        setTopVote(sortedTopVote);
    } catch (error) {
        console.error("Error fetching tags:", error);
    }
};

function MostCommentedTopics ({ walletAddress}){
    const [footer] = useState(['About Us', 'Terms of Service', 'Privacy Policy', 'Contact Us']);
    const [nav] = useState(['New Topic', 'Hot Picks', 'Trending Tags', 'Top Voted']);
    const [topic, setTopic] = useState([]);
    const [topVote, setTopVote] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchTopics(setTopic);
        fetchTopVote(setTopVote);
        connectWallet();
    }, []);

    const handleOpenModal = (topic) => {
        setSelectedTopic(topic);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTopic(null);
        fetchTopics(setTopic);
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

    return (
        <div>
            <Navbar goHome={goHome} goTop={goTop} goTopVote={goTopVote} goTags={goTags}/>
            <Container sx={{  height: 'auto', minHeight: '80.3vh', overflow: 'auto', marginTop: '20px', paddingBottom: '20px', scrollbarWidth: 'none', }}>
                <Grid container spacing={3} justifyContent="center" >
                    <Grid item xs={12} md={8} sx={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginTop:'30px'}}>
                        <Typography variant="h4" gutterBottom><strong>Most Commented Topics</strong></Typography>
                        <Grid container spacing={3}>
                            {topic.map((topic) => (
                                <Grid item xs={12} key={topic.publicKey.toString()} >
                                    <Card onClick={() => handleOpenModal(topic)} sx={{ '&:hover': { cursor: 'pointer', backgroundColor: 'black', color:'white', transform: 'scale(1.05)'} }}>
                                        <CardContent>
                                            <Typography variant="h5" component="div">{topic.account.name}</Typography>
                                            <Typography variant="h7" >{topic.account.commentCount} comments</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={2.5} sx={{ height: '293px',border: '1px solid #ccc', borderRadius: '8px', marginLeft:'30px', marginTop:'30px', overflow:'hidden', paddingBottom: '30px'}}>
                        <Typography variant="h5" gutterBottom><strong>Popular Topics</strong></Typography>
                        <Grid container spacing={0.5}>
                        {topVote.slice(0, 8).map((topic) => (
                            <Grid item xs={12} key={topic.publicKey.toString()}>
                                <Typography variant="h7" component="div" sx={{ pl: 2 }}>{topic.account.name}</Typography>
                            </Grid>
                        ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <footer style={{padding: '20px 0', backgroundColor: '#f5f5f5' }}>
                <Container>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Typography variant="body1">
                                {footer.map((topic, index) => (
                                    <span key={index} style={{ margin: '0 10px' }}>{topic}</span>
                                ))}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </footer>

            <TopicModal open={openModal} handleClose={handleCloseModal} topic={selectedTopic} walletAddress={walletAddress}/>
        </div>
    );
};

export default MostCommentedTopics;
