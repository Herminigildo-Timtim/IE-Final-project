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
const programID = new PublicKey('GBsJRQGqouAVpVC5Snouf6vsuVciLKfaMSmxoYqJ1o3k');
const network = "https://api.devnet.solana.com";

const AddTopicTags = ({walletAddress, balance}) => {
    const PROGRAM_ID = new PublicKey(idl.metadata.address);
    // const [walletAddress, setWalletAddress] = useState(null);
    const [footer] = useState(['Home', 'About Us', 'Contact', 'Term & Condition']);
    const [nav] = useState(['Home', 'Top Votes', 'Top Comments']);
    const [topicTags, setTopicTags] = useState([]);
    const [tagName, setTagName] = useState('');
    // const [balance, setBalance] = useState(null);

    // const connectWallet = async () => {
    //     const { solana } = window;
    //     try {
    //       if (solana) {
    //         const response = await solana.connect();
    //         setWalletAddress(response.publicKey.toString());
      
    //         // Move the console.log after setting the state
    //         console.log("Wallet Address:", response.publicKey.toString());
    //         fetchBalance(response.publicKey.toString());
    //         // Create a PublicKey instance after setting walletAddress
            
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }

    //   const fetchBalance = async (walletAddress) => {
    //     try {
    //       const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
    //       const publicKeyObj = new Web3.PublicKey(walletAddress);
    //       const solBalance = await connection.getBalance(publicKeyObj);
    //       // Divide the balance by 1,000,000,000
    //       const adjustedBalance = solBalance / 1000000000;
    //       setBalance(adjustedBalance); // Update the balance state here
    //       return adjustedBalance;
    //     } catch (error) {
    //       console.error("Error fetching balance:", error);
    //     }
    //   };
    useEffect(() => {
        // connectWallet();
        fetchTags();
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
            const fetchedTags = await program.account.tagAccount.all();
            console.log("Fetched Tags:", fetchedTags);
            setTopicTags(fetchedTags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleAddTag = async () => {
        const provider = getProvider();
        const program = await createCustomProgram();
        const tagAccount = web3.Keypair.generate();

        try {
            const tx = await program.rpc.addTag(tagName, {
                accounts: {
                    tagAccount: tagAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [tagAccount],
                instructions: [
                    SystemProgram.createAccount({
                        fromPubkey: provider.wallet.publicKey,
                        newAccountPubkey: tagAccount.publicKey,
                        space: program.account.tagAccount.size,
                        lamports: await provider.connection.getMinimumBalanceForRentExemption(program.account.tagAccount.size),
                        programId: program.programId,
                    }),
                ],
            });

            console.log("Tag added successfully", tx);
            fetchTags();
        } catch (error) {
            console.error("Error adding tag:", error);
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
                    <Button variant="contained" color="primary" onClick={handleAddTag} style={{backgroundColor: 'black', height: '56px', width: '120px'}}>
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

  
