import '../AddTopicMostComment.css';
import { useEffect, useState } from "react";
import { Container, Box, Typography, TextField, Button, AppBar, Toolbar, IconButton, Grid, Card, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import * as Web3 from '@solana/web3.js';
import idl from '../idl.json';
import { Buffer } from "buffer";
import { PublicKey, SystemProgram, Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

window.Buffer = Buffer;
const programID = new PublicKey('BEVinZuS49SupTm5yihoaALrxdoqzvkFn5JH7933rkie');
const network = "https://api.devnet.solana.com";
// const network = clusterApiUrl('devnet');

const AddTopicTags = () => {
    const PROGRAM_ID = new PublicKey(idl.metadata.address);
    const [walletAddress, setWalletAddress] = useState(null);
    const [footer] = useState(['Home', 'About Us', 'Contact', 'Term & Condition']);
    const [nav] = useState(['Home', 'Top Votes', 'Top Comments']);
    // const [tags, setTags] = useState(['React', 'HTML', 'CSS', 'JavaScript', 'Axios', 'Router', 'Hooks', 'DOM', 'Async']);
    const [topicTags, setTopicTags] = useState([]);
    const [error, setError] = useState([]);
    const [tagName, setTagName] = useState('');

    useEffect(() => {
        fetchTags();
        setWalletAddress("2tzZCiaXqxEcNsDUssUcr1rCh1Yxtze7vd6TihJMNCBM");
      }, []);

    const opts = {
        preflightCommitment: "processed"
    }

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(
            connection,
            window.solana,
            opts.preflightCommitment,
        );
        return provider;
    };
    const createCustomProgram = async () => {
        console.log("PROGRAM_ID:", PROGRAM_ID.toString());
        return new Program(idl, PROGRAM_ID, getProvider());
      }
    const fetchTags = async () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(connection, window.solana, opts);
        const program = new Program(idl, programID, provider);

        try {
            const fetchedTags = await program.account.tagNameAccount.all();
            console.log("Fetched Tags:", fetchedTags);
            setTopicTags(fetchedTags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleAddTag = async () => {
        const provider = getProvider();
      const program = await createCustomProgram();
  
      const tagAccount = web3.Keypair.generate(); // Create a new Keypair for the tag account
        console.log(provider.wallet.publicKey);
        try {
            const tx = await program.rpc.addTagname(tagName, {
                accounts: {
                  tagAccount: tagAccount.publicKey,
                  authority: new PublicKey(walletAddress),
                },
                signers: [tagAccount],
              });
              
          console.log("Tag added successfully", tx);
    
          // Fetch and update the tags after adding a new one
          const fetchedTags = await program.account.tagNameAccount.all();
          setTopicTags(fetchedTags);
        } catch (error) {
          console.error("Error adding tag:", error);
        }
      };

    return(
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
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
            <Container>
                <Box my={4}>
                    <Typography variant="h4" gutterBottom>
                        Add Topic Tags
                    </Typography>
                    <TextField
                        label="Enter tag name"
                        variant="outlined"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        style={{ marginRight: 16 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddTag}>
                        Add Tag
                    </Button>
                </Box>
                <Box my={4}>
                    <Typography variant="h4" gutterBottom>
                        Topic Tags List
                    </Typography>
                    <Grid container spacing={2}>
                        {topicTags.map((tag) => (
                            <Grid item key={tag.publicKey.toString()} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">{tag.account.tagName}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            <Box mt={5} py={3} bgcolor="grey.200">
                <Container>
                    <Grid container spacing={3}>
                        {footer.map((topic, index) => (
                            <Grid item key={index}>
                                <Typography>{topic}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </div>
    );
  };
  
  export default AddTopicTags;

  
