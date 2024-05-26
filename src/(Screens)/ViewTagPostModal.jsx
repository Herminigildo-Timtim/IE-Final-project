import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Grid, Card, CardContent} from '@mui/material';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider} from '@project-serum/anchor';
import idl from '../idl.json';
import ViewPostDetailsModal from './ViewPostDetailsModal';

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
    padding: 5,
    overflowY: 'auto',
};

const PROGRAM_ID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl('devnet');
const opts = { preflightCommitment: "processed" };

const connection = new Connection(network, opts.preflightCommitment);
const provider = new AnchorProvider(connection, window.solana, opts);
const program = new Program(idl, PROGRAM_ID, provider);

const ViewTagPostModal = ({ open, close, tag }) => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = (post) => {
        setSelectedPost(post);
        setOpenModal(true);
        console.log(post)
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPost(null);
    };

    const fetchPostsByTagName = async (tagName) => {
        try {
            const fetchedPosts = await program.account.addTagAccount.all();
            const matchingPosts = fetchedPosts.filter(post => post.account.name === tagName);
            const postId = matchingPosts.map(post => post.account.id.toString());

            fetchPostsByIds(postId);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
        }
    };

    const fetchPostsByIds = async (postIds) => {
        try {
            const fetchedPosts = await program.account.postAccount.all();
            const filteredPosts = fetchedPosts.filter(post => postIds.includes(post.publicKey.toString()));
            setPosts(filteredPosts);
            console.log(filteredPosts);
        } catch (error) {
            console.error("Error fetching posts by IDs:", error);
            setPosts([]);
        }
    };

    useEffect(() => {
        if (tag) {
            fetchPostsByTagName(tag.tagName);
        }
    }, [tag]);

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        ><>
            <Box sx={style}>
                <Typography id="modal-title" variant="h4" component="h2">
                    {tag.tagName}
                </Typography>
                <Typography id="modal-title" variant="h6" component="h2">
                   Tag Public Key: {tag.pubKey}
                </Typography>
                <div style={{overflow: 'auto', height: '333px', display: 'flex', flexDirection: 'column', alignItems: "center", marginTop: "10px"}} >
                    {posts.map((post) => (
                        <Grid item xs={12} key={post.publicKey.toString()} sx={{ width: '90%', marginBottom: '5px'}}>
                        <Card onClick={() => handleOpenModal(post)} sx={{ '&:hover': { cursor: 'pointer', backgroundColor: 'black', color:'white', transform: 'scale(1.05)'} }}>
                            <CardContent  sx={{ padding: '10px'}}>
                                <Typography variant="h6" component="div">{post.account.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </div>
                <Button onClick={close} variant="contained" color="primary" sx={{ mt: 2 , marginRight: '10px', backgroundColor: 'black', '&:hover': { cursor: 'pointer', backgroundColor: 'white', color:'black', transform: 'scale(1.05)'}}}>
                    Close
                </Button>
            </Box>
            <ViewPostDetailsModal open={openModal} handleClose={handleCloseModal} postsDetails={selectedPost} />
            </>
        </Modal>
    );
};

export default ViewTagPostModal;
