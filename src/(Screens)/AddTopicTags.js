import '../AddTopicMostComment.css';
import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, AppBar, Toolbar, IconButton, Grid, Card, CardContent } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import idl from '../idl.json';
import { Buffer } from "buffer";
import { PublicKey, Connection} from "@solana/web3.js";
import { Program, AnchorProvider } from '@project-serum/anchor';
import ViewTagPostModal from './ViewTagPostModal';

window.Buffer = Buffer;
const PROGRAM_ID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";

const AddTopicTags = () => {
    const [footer] = useState(['About Us', 'Terms of Service', 'Privacy Policy', 'Contact Us']);
    const [nav] = useState(['New Topic', 'Hot Picks', 'Trending Tags', 'Top Voted']);
    const [topicTags, setTopicTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

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

            if (!tagCounts[tagName]) {
                tagCounts[tagName] = { count: 0, ids: '' };
            }
            tagCounts[tagName].count += 1;
            tagCounts[tagName].ids = tagId;
        });

        // Convert the tagCounts object to an array of { tagName, count, ids } objects
        const tagCountsArray = Object.keys(tagCounts).map(tagName => ({
            tagName,
            count: tagCounts[tagName].count,
            id: tagCounts[tagName].ids,
        }));

        // Sort the array by count in descending order
        tagCountsArray.sort((a, b) => b.count - a.count);

        console.log("Sorted Tag Counts:", tagCountsArray);
        setTopicTags(tagCountsArray);
        console.log(topicTags);
    } catch (error) {
        console.error("Error fetching tags:", error);
    }
};


    return(
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
            {selectedTag && <ViewTagPostModal tagName={selectedTag.tagName} open={!!selectedTag} close={handleCloseModal} pubKey={selectedTag.id}/>}
        </div>
    );
  };
  
  export default AddTopicTags;

  
