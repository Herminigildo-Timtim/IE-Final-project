import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider} from '@project-serum/anchor';
import idl from '../idl.json';
import ViewCommentModal from './ViewCommentModal';
import CommentModal from './Pop-Up Screens/commentmodal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    backgroundColor: 'white', 
    borderRadius: 10, 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: 5,
    overflowY: 'auto',
};

const PROGRAM_ID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";
const opts = { preflightCommitment: "processed" };

export const fetchComments = async (postPublicKey, setComments) => {
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

const TopicModal = ({ open, handleClose, topic, walletAddress }) => {
    const [comments, setComments] = useState([]);
    const [postPublicKey, setPostPublicKey] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [openCommentModal, setOpenCommentModal] = useState(false);

    useEffect(() => {
        if (topic) {
            setPostPublicKey(topic.publicKey.toString());
            fetchComments(topic.publicKey, setComments);
        }
    }, [topic]);

    const handleOpenModal = (comment) => {
        setSelectedComment(comment);
        console.log(comments);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenCommentModal(false);
        setSelectedComment(null);
        fetchComments(topic.publicKey, setComments);
    };

    const openComment = (comment) => {
        setOpenCommentModal(true);
        setSelectedComment(comment);
    }
    return (
    <>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        ><>
            <Box sx={style}>
                <Typography id="modal-title" variant="h4" component="h2">
                    {topic?.account?.name}
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 2 }}>
                    Post Public Key: {postPublicKey}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {topic ? `This topic has ${topic.account.commentCount} comment(s).` : 'No topic selected.'}
                </Typography>
                <div style={{overflow: 'auto', height: '333px', display: 'flex', flexDirection: 'column', alignItems: "center"}} >
                    {comments.map((comment) => (
                        <Grid item xs={10} key={comment.publicKey.toString()} sx={{ width: '90%'}}>
                        <Card onClick={() => handleOpenModal(comment)} sx={{ '&:hover': { cursor: 'pointer', backgroundColor: 'black', color:'white', transform: 'scale(1.05)'} }}>
                            <CardContent  sx={{ padding: '10px'}}>
                                <Typography variant="h6" component="div">{comment.account.content}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </div>
                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Close
                </Button>
                <Button onClick={openComment} variant="contained" color="primary" sx={{ mt: 2}}>
                    Comment
                </Button>
            </Box>
            <ViewCommentModal open={openModal} handleClose={handleCloseModal} commentDetails={selectedComment} />
            </>
        </Modal>
        <CommentModal 
            open={openCommentModal} 
            onClose={handleCloseModal} 
            selectedPostKey={postPublicKey} 
            getProvider={getProvider} 
            createCustomProgram={createCustomProgram} // Pass createCustomProgram here
            setSelectedPostComment={setSelectedComment}
            walletAddress={walletAddress}
        />
    </>
    );
};

export default TopicModal;