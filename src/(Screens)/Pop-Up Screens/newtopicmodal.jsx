import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { web3 } from '@project-serum/anchor';
import { SystemProgram } from "@solana/web3.js";

function NewTopicModal({ onClose, open, getProvider, createCustomProgram, postList }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [openMyTags, setOpenMyTags] = useState(false);
    const [openAllTags, setOpenAllTags] = useState(false);

    useEffect(() => {
        // API to get the tags and save the values
    }, []);

    const handlePost = async () => {
        if (!title || !tags.length || !description) {
            toast.error("Please fill out all fields!");
        } else {
            try {
                await createPost(
                    getProvider,
                    createCustomProgram,
                    postList,
                    setTitle,
                    setDescription,
                    setTags
                );
                toast.success("Topic Posted");
                onClose();
            } catch (error) {
                toast.error("Failed to post topic");
                console.error("Error creating post:", error);
            }
        }
    };

    const addTag = () => {

    }
    const handleTagsClose = (selectedTags) => {
        setOpenMyTags(false);
        setOpenAllTags(false);
        setTags(selectedTags);
    };

    const createPost = async (getProvider, createCustomProgram, postList, setTitle, setDescription, setTags) => {
        try {
            const provider = getProvider();
            const program = await createCustomProgram();
            const postAccount = web3.Keypair.generate();

            await program.rpc.initPost({
                accounts: {
                    postAccount: postAccount.publicKey,
                    authority: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                    clock: web3.SYSVAR_CLOCK_PUBKEY,
                },
                signers: [postAccount],
            });
            postList();
            setTitle("");
            setDescription("");
            setTags([]);
            console.log("Created a new PostAccount w/ address:", postAccount.publicKey.toString());
        } catch (error) {
            console.log("Error in creating PostAccount: ", error);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>
                    {/* For Topic Title */}
                    <Typography variant="h6">
                        Topic
                    </Typography>
                    <TextField
                        variant="filled"
                        placeholder="Title"
                        className="topic"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required={true}
                        style={{
                            width: '100%',
                            marginBottom: '20px',
                        }}
                    />

                    {/* Tag for the topic */}
                    <Typography style={{ marginBottom: '10px' }}>
                        Tag
                    </Typography>
                    <div style={{ flex: '1', flexDirection: "row" }}>
                        <Button onClick={addTag}>
                            Add Tag
                        </Button>
                    </div>

                    {tags.length > 0 && (
                        <Box style={{ marginTop: "10px" }}>
                            {tags.map((tag, index) => (
                                <Box key={index} sx={{ display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}>
                                    <Typography variant="body1" sx={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'inline-block' }}>
                                        {tag}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* For the topic description */}
                    <Typography style={{ marginBottom: '10px' }}>
                        Description
                    </Typography>
                    <TextField
                        variant="filled"
                        placeholder="Topic Description"
                        className="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required={true}
                        style={{
                            width: '100%',
                            marginBottom: '20px',
                        }}
                    />

                    {/* Button for post */}
                    <Typography style={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            onClick={handlePost}
                            style={{
                                backgroundColor: 'white',
                                color: 'black',
                            }}
                        >
                            POST
                        </Button>
                    </Typography>
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

export default NewTopicModal;


export function AddTag({ openTag, closeTag }) {
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState([]);

    const handleAddTag = () => {
        if (tag.trim() !== "") {
            setTags([...tags, tag]);
            setTag("");
        }
    };

    return (
        <Modal
            open={openTag}
            onClose={closeTag}
        >
            <Box sx={style}>
                <TextField
                    variant="filled"
                    placeholder="Add Tag"
                    className="topic"
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    required
                    style={{
                        width: '100%',
                        marginBottom: '20px',
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTag}
                    style={{
                        width: '100%',
                    }}
                >
                    Add Tag
                </Button>
                <div style={{ marginTop: '20px' }}>
                    {tags.map((tag, index) => (
                        <div key={index}>{tag}</div>
                    ))}
                </div>
            </Box>
        </Modal>
    );
}