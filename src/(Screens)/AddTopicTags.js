import '../AddTopicMostComment.css';
import { useEffect, useState } from "react";
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import idl from '../idl.json';
import { Buffer } from "buffer";
import { PublicKey, Connection} from "@solana/web3.js";
import { Program, AnchorProvider } from '@project-serum/anchor';
import ViewTagPostModal from './ViewTagPostModal';
import { useNavigate } from "react-router-dom";
import logo from "./../(Components)/images/logo.webp";

window.Buffer = Buffer;
const PROGRAM_ID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";


function AddTopicTags({ walletAddress }){
    const [footer] = useState(['About Us', 'Terms of Service', 'Privacy Policy', 'Contact Us']);
    const [topicTags, setTopicTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        fetchTags();
      }, []);

    const opts = {
        preflightCommitment: "processed"
    }

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
      };
    
      const handleCloseModal = () => {
        setSelectedTag(null);
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
    return(
        <div>
            <header className="header-header">
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
            <Container sx={{ height: 'auto', minHeight: '77.1vh' }}>
                <Box mt={4}>
                    <Typography variant="h4" gutterBottom>
                        Topic Tags List
                    </Typography>
                    <Grid container spacing={2}>
                        {topicTags.map((tag, index) => (
                            <Grid item key={index} xs={12} sm={6} md={3} onClick={() => handleTagClick(tag)}>
                                <Card sx={{ '&:hover': { cursor: 'pointer', backgroundColor: 'black', color:'white', transform: 'scale(1.05)'} }}>
                                    <CardContent>
                                        <Typography variant="h6">{tag.tagName}</Typography>
                                        <Typography variant="h6">{tag.count} post</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            <footer style={{ marginTop: '10px', padding: '20px 0', backgroundColor: '#f5f5f5' }}>
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
            {selectedTag && <ViewTagPostModal tag={selectedTag} open={!!selectedTag} close={handleCloseModal}/>}
        </div>
    );
  };
  
  export default AddTopicTags;

  
