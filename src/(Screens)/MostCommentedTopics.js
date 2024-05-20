import {useEffect, useState} from "react";
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, IconButton, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TopicModal from './TopicModal';
import { PublicKey, Connection } from "@solana/web3.js";
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from '../idl.json';
import { Buffer } from "buffer";
import { fetchBalance } from "../functions/functions";

window.Buffer = Buffer;
const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";
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

const MostCommentedTopics = ({ walletAddress, balance}) => {
    const [footer] = useState(['About Us', 'Terns of Service', 'Privacy Policy', 'Contact Us']);
    const [nav] = useState(['New Topic', 'Hot Picks', 'Trending Tags', 'Top Voted']);
    const [topic, setTopic] = useState([]);
    const [topVote, setTopVote] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    
    useEffect(() => {
        fetchTopics(setTopic);
        fetchTopVote(setTopVote);
    }, []);

    const handleOpenModal = (topic) => {
        setSelectedTopic(topic);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTopic(null);
    };

    return (
        <div>
            <AppBar position="static" style={{backgroundColor: 'white', color: 'black'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                    <svg className="logoIcon" viewBox="0 0 512 512" width="40" height="40">
                        <path d="M234.5 5.709C248.4 .7377 263.6 .7377 277.5 5.709L469.5 74.28C494.1 83.38 512 107.5 512 134.6V377.4C512 404.5 494.1 428.6 469.5 437.7L277.5 506.3C263.6 511.3 248.4 511.3 234.5 506.3L42.47 437.7C17 428.6 0 404.5 0 377.4V134.6C0 107.5 17 83.38 42.47 74.28L234.5 5.709zM256 65.98L82.34 128L256 190L429.7 128L256 65.98zM288 434.6L448 377.4V189.4L288 246.6V434.6z"></path>
                    </svg>
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 , fontWeight: '800'}}>
                        blockNote
                    </Typography>
                    {nav.map((topic, index) => (
                        <Button key={index} color="inherit">{topic}</Button>
                    ))}
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>

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

            <TopicModal open={openModal} handleClose={handleCloseModal} topic={selectedTopic} walletAddress={walletAddress} setBalance={balance} fetchBalance={fetchBalance} />
        </div>
    );
};

export default MostCommentedTopics;
