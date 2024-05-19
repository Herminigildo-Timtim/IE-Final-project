import React from 'react';
import { Modal, Box, Typography, Button} from '@mui/material';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider} from '@project-serum/anchor';
import idl from '../idl.json';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', 
    maxWidth: 1000, 
    height: 'auto', 
    maxHeight: '80vh',
    backgroundColor: 'white', 
    borderRadius: 10, 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: 20,
    overflowY: 'auto',
};

const PROGRAM_ID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";
const opts = { preflightCommitment: "processed" };

const ViewTagPostModal = ({ open, close, tagName, key }) => {

    const formatDate = (time) => {
        const timestamp = parseInt(time) * 1000;
        const date = new Date(timestamp);

        const formattedDate = date.toLocaleDateString('en-US');
        const formattedTime = date.toLocaleTimeString('en-US');

        const formattedDateTime = `${formattedDate} ${formattedTime}`;
        return formattedDateTime.toLocaleString();
    };

    const fetchComments = async (postPublicKey, setComments) => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(connection, window.solana, opts);
        const program = new Program(idl, PROGRAM_ID, provider);
    
        try {
            const fetchedComments = await program.account.commentAccount.all();
            // Filter comments where the postId matches the selected topic's publicKey
            const filteredComments = fetchedComments.filter(comment => comment.account.id.equals(postPublicKey));
            setComments(filteredComments);
            console.log(filteredComments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const fetchPostIdsByName = (tagName, accounts) => {
        const matchingIds = [];
        accounts.forEach(account => {
          if (account.account.name === tagName) {
            matchingIds.push(account.account.id);
          }
        });
        return matchingIds;
    };

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2">
                    {tagName}
                </Typography>
                <Typography id="modal-title" variant="h6" component="h2">
                    {key}
                </Typography>
                {/* <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Commented by: {commentDetails?.account?.user?.toString()}
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Comment Public Key: {commentDetails?.publicKey?.toString()}
                </Typography> */}
                {/* <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Date: {formatDate(commentDetails?.account?.timestamp)}
                </Typography> */}
                <Button onClick={close} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ViewTagPostModal;
