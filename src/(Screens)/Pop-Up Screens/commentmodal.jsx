import { Typography, Modal, TextField, Button, Box } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import idl from './idl.json';
import { PublicKey, SystemProgram, Connection, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

window.Buffer = Buffer;
const network = clusterApiUrl('devnet');

function CommentModal({open, onClose, walletAddress, selectedPostKey}){
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [selectedPostComment,setSelectedPostComment] = useState("");
    const [commentInput, setCommentInput] = useState("");
    const [topVotes, setTopVotes] = useState([]);
    const [topComments, setTopComments] = useState([]);

    const PROGRAM_ID = new PublicKey(idl.metadata.address);

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

    const updateBalance = async () => {
        try {
          const adjustedBalance = await fetchBalance(walletAddress);
          setBalance(adjustedBalance);
        } catch (error) {
          console.error("Error updating balance:", error);
        }
    };

    const postList = async () => {
        try {
          const program = await createCustomProgram();
          const accounts = await program.account.postAccount.all(); // Fetch all post accounts
          
          const sortedPosts = accounts.sort((a, b) => b.account.timestamp - a.account.timestamp);
          setPosts(sortedPosts);
    
          const topVotes = sortedPosts
          .filter(post => post.account.voteCount > 0)
            .sort((a, b) => b.account.voteCount - a.account.voteCount)
            .slice(0, 5);
          setTopVotes(topVotes);
    
          // Update top comments
          const topComments = sortedPosts
            .filter(post => post.account.commentCount > 0)
            .sort((a, b) => b.account.commentCount - a.account.commentCount)
            .slice(0, 5);
          setTopComments(topComments);
    
        } catch (error) {
          console.log("Error in postList: ", error);
        }
    };
    
    const commentList = async () => {
        try {
            const program = await createCustomProgram();
            const accounts = await program.account.commentAccount.all(); // Fetch all post accounts

            setComments(accounts);
        } catch (error) {
            console.log("Error in commentList: ", error);
        }
    };

    const createComment = async (content) => {
        try {
          // Check if the content is empty or ""
          if (!content || content.trim() === "") {
            console.log("Content is empty. Comment not created.");
            return;
          }
      
          const provider = getProvider();
          const program = await createCustomProgram();
      
          const commentAccount = web3.Keypair.generate();
      
          await program.rpc.createComment(content, {
            accounts: {
              commentAccount: commentAccount.publicKey,
              postAccount: new PublicKey(selectedPostKey),
              authority: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
            },
            signers: [commentAccount],
          });
      
          console.log("Created a new CommentAccount w/ address:", commentAccount.publicKey.toString());
          setCommentInput("");
          updateBalance();
          postList();
          commentList();
          setSelectedPostComment((prevComment) => prevComment + 1);
        } catch (error) {
          console.log("Error in creating Comment: ", error);
        }
      };

    const handleComment = (event) => {
        if (!comment) {
            toast.error("Please fill out all fields!");
        } else {
            toast.success("Comment Posted");
        }
        onClose();
    }

    return (
        <>
            <Modal
                open={true}
                onClose={onClose}>
                <Box sx={style}>
                    <Typography>
                        Comment
                    </Typography>
                    <TextField
                        variant="filled"
                        placeholder="Comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        required={true}
                        style={{
                            width: '100%',
                            marginBottom: '20px',
                        }}/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button
                            variant="contained"
                            onClick={createComment}>
                            Comment
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default CommentModal;