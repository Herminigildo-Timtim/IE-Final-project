import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from '../idl.json';
import { Height } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const programID = new PublicKey('BEVinZuS49SupTm5yihoaALrxdoqzvkFn5JH7933rkie');
const network = "https://api.devnet.solana.com";
const opts = { preflightCommitment: "processed" };

const fetchComments = async (postPublicKey, setComments) => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts);
    const program = new Program(idl, programID, provider);

    try {
        const fetchedComments = await program.account.commentAccount.all();
        // Filter comments where the postId matches the selected topic's publicKey
        const filteredComments = fetchedComments.filter(comment => comment.account.id.equals(postPublicKey));
        setComments(filteredComments);
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
};

const TopicModal = ({ open, handleClose, topic }) => {
    const [comments, setComments] = useState([]);
    const [publicKey, setPublicKey] = useState('');

    useEffect(() => {
        if (topic) {
            setPublicKey(topic.publicKey.toString());
            fetchComments(topic.publicKey, setComments);
        }
    }, [topic]);
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2">
                    {topic?.account?.name}
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 2 }}>
                    Post Public Key: {publicKey}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {topic ? `This topic has ${topic.account.commentCount} comments.` : 'No topic selected.'}
                </Typography>
                <div>
                    {comments.map((comment) => (
                        <Grid item xs={12} key={comment.publicKey.toString()}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">{comment.account.content}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </div>
                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default TopicModal;
